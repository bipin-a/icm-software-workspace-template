import { execFile, spawn } from 'node:child_process';
import { hostname, release as osRelease } from 'node:os';
import {
  mkdir,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { candidateGateConfigurationErrors } from './config.mjs';

const execFileAsync = promisify(execFile);

async function git(cwd, args, { allowFailure = false } = {}) {
  try {
    const result = await execFileAsync('git', args, { cwd, encoding: 'utf8' });
    return result.stdout.trim();
  } catch (error) {
    if (allowFailure) return '';
    throw error;
  }
}

export async function candidateState(cwd) {
  const [worktreePath, gitDirPath, commonGitDirPath] = await Promise.all([
    git(cwd, ['rev-parse', '--path-format=absolute', '--show-toplevel']),
    git(cwd, ['rev-parse', '--path-format=absolute', '--git-dir']),
    git(cwd, ['rev-parse', '--path-format=absolute', '--git-common-dir']),
  ]);
  const [worktree, gitDir, commonGitDir] = await Promise.all([
    realpath(worktreePath),
    realpath(gitDirPath),
    realpath(commonGitDirPath),
  ]);
  const [status, commit, tree, branch] = await Promise.all([
    git(worktree, ['status', '--porcelain=v1', '--untracked-files=all']),
    git(worktree, ['rev-parse', 'HEAD']),
    git(worktree, ['rev-parse', 'HEAD^{tree}']),
    git(worktree, ['symbolic-ref', '--short', '-q', 'HEAD'], { allowFailure: true }),
  ]);
  return {
    branch: branch || '(detached)',
    commit,
    commonGitDir,
    gitDir,
    linkedWorktree: gitDir !== commonGitDir,
    status,
    tree,
    worktree,
  };
}

export async function loadIcmConfig(cwd) {
  const state = await candidateState(cwd);
  let config;
  try {
    config = JSON.parse(await readFile(join(state.worktree, 'icm.config.json'), 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read icm.config.json: ${error.message}`);
  }
  if (config?.schemaVersion !== 1 || !config.candidateGate) {
    throw new Error('icm.config.json must declare schemaVersion 1 and candidateGate');
  }
  return { config, state };
}

export function validateGateConfig(gate) {
  const failures = candidateGateConfigurationErrors(gate);
  if (failures.length > 0) throw new Error(`Invalid candidateGate: ${failures.join('; ')}`);
  if (!gate.enabled) throw new Error('The candidate gate is disabled until repository commands are configured');
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

export function linuxProcessStart(statBody) {
  const closingParenthesis = statBody.lastIndexOf(')');
  if (closingParenthesis < 0) return null;
  const fieldsAfterName = statBody.slice(closingParenthesis + 1).trim().split(/\s+/);
  const startTime = fieldsAfterName[19];
  return startTime ? `linux-proc:${startTime}` : null;
}

export async function processStartIdentity(pid) {
  if (!Number.isInteger(pid) || pid < 1) return null;
  try {
    if (process.platform === 'linux') {
      return linuxProcessStart(await readFile(`/proc/${pid}/stat`, 'utf8'));
    }
    const result = process.platform === 'win32'
      ? await execFileAsync('powershell.exe', [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        `(Get-Process -Id ${pid}).StartTime.ToUniversalTime().ToString('o')`,
      ], { encoding: 'utf8' })
      : await execFileAsync('ps', ['-p', String(pid), '-o', 'lstart='], {
        encoding: 'utf8',
      });
    return result.stdout.trim() || null;
  } catch {
    return null;
  }
}

async function lockOwnerIsActive(owner) {
  if (
    owner?.kind !== 'icm-candidate-gate-lock'
    || owner.hostname !== hostname()
    || !Number.isInteger(owner.pid)
    || typeof owner.processStartedAt !== 'string'
    || owner.processStartedAt.length === 0
  ) {
    throw new Error('lock identity is incomplete or belongs to another host');
  }
  return await processStartIdentity(owner.pid) === owner.processStartedAt;
}

async function acquireCandidateLock(path, state) {
  const owner = {
    kind: 'icm-candidate-gate-lock',
    hostname: hostname(),
    pid: process.pid,
    processStartedAt: await processStartIdentity(process.pid),
    tree: state.tree,
    worktree: state.worktree,
  };
  if (!owner.processStartedAt) throw new Error('Cannot establish candidate-gate process identity');

  while (true) {
    try {
      await writeFile(path, `${JSON.stringify(owner)}\n`, { flag: 'wx' });
      return owner;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
    }
    const existing = await readJson(path);
    if (!existing) continue;
    let active;
    try {
      active = await lockOwnerIsActive(existing);
    } catch (error) {
      throw new Error(`Cannot recover candidate-gate lock ${path}: ${error.message}`);
    }
    if (active) throw new Error(`Candidate gate is already running for tree ${state.tree}`);
    const stalePath = `${path}.stale.${process.pid}.${Date.now()}`;
    try {
      await rename(path, stalePath);
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
      throw error;
    }
    await rm(stalePath, { force: true });
  }
}

async function writeJsonAtomically(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  try {
    await rename(temporaryPath, path);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

async function runCommand(command, cwd, environment) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command[0], command.slice(1), {
      cwd,
      env: environment,
      stdio: 'inherit',
    });
    child.once('error', rejectPromise);
    child.once('exit', (code) => resolvePromise(Number.isInteger(code) ? code : 1));
  });
}

function successfulReceipt(receipt, tree, gate) {
  if (
    receipt?.schemaVersion !== 1
    || receipt.kind !== 'icm-candidate-gate-receipt'
    || receipt.tree !== tree
    || receipt.result?.status !== 'success'
    || receipt.result?.exitCode !== 0
  ) return false;
  if (!Array.isArray(receipt.phases) || receipt.phases.length !== gate.phases.length) return false;
  return gate.phases.every((phase, index) => {
    const recorded = receipt.phases[index];
    return recorded?.name === phase.name && recorded.status === 'success'
      && recorded.exitCode === 0 && JSON.stringify(recorded.command) === JSON.stringify(phase.command);
  });
}

function gateEnvironment() {
  return {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    osRelease: osRelease(),
    hostname: hostname(),
  };
}

export async function runCandidateGate({ cwd = process.cwd(), now = () => new Date() } = {}) {
  const { config, state } = await loadIcmConfig(cwd);
  const gate = config.candidateGate;
  validateGateConfig(gate);
  if (state.status) throw new Error(`The candidate worktree is not clean:\n${state.status}`);
  if (!state.linkedWorktree) {
    throw new Error('The candidate gate requires a linked worktree');
  }

  const receiptDirectory = join(state.commonGitDir, 'icm-gate-receipts');
  const receiptPath = join(receiptDirectory, `${state.tree}.json`);
  await mkdir(receiptDirectory, { recursive: true });
  const lockPath = join(receiptDirectory, `${state.tree}.lock`);
  await acquireCandidateLock(lockPath, state);

  try {
    const prior = await readJson(receiptPath);
    if (successfulReceipt(prior, state.tree, gate)) {
      throw new Error(`Tree ${state.tree} already has a successful candidate-gate receipt at ${receiptPath}`);
    }
    const startedAt = now();
    const phases = [];
    let exitCode = 0;
    let reason;
    for (const phase of gate.phases) {
      if (exitCode !== 0) {
        phases.push({
          name: phase.name,
          command: phase.command,
          status: 'skipped',
          exitCode: null,
          reason: 'an earlier phase failed',
        });
        continue;
      }
      const phaseStartedAt = now();
      let phaseExitCode = 1;
      let errorMessage;
      try {
        phaseExitCode = await runCommand(phase.command, state.worktree, process.env);
      } catch (error) {
        errorMessage = error.message;
      }
      const phaseFinishedAt = now();
      phases.push({
        name: phase.name,
        command: phase.command,
        status: phaseExitCode === 0 ? 'success' : 'failure',
        exitCode: phaseExitCode,
        ...(errorMessage ? { error: errorMessage } : {}),
        startedAt: phaseStartedAt.toISOString(),
        finishedAt: phaseFinishedAt.toISOString(),
        durationMs: Math.max(0, phaseFinishedAt - phaseStartedAt),
      });
      if (phaseExitCode !== 0) {
        exitCode = phaseExitCode;
        reason = `phase ${phase.name} failed`;
      }
    }

    try {
      const after = await candidateState(state.worktree);
      if (after.commit !== state.commit || after.tree !== state.tree || after.status) {
        exitCode = 1;
        reason = 'candidate gate changed candidate state';
      }
    } catch (error) {
      exitCode = 1;
      reason ??= `candidate reinspection failed: ${error.message}`;
    }
    const finishedAt = now();
    const receipt = {
      schemaVersion: 1,
      kind: 'icm-candidate-gate-receipt',
      commit: state.commit,
      tree: state.tree,
      branch: state.branch,
      worktree: state.worktree,
      phases,
      environment: gateEnvironment(),
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Math.max(0, finishedAt - startedAt),
      result: {
        status: exitCode === 0 ? 'success' : 'failure',
        exitCode,
        ...(reason ? { reason } : {}),
      },
    };
    await writeJsonAtomically(receiptPath, receipt);
    return {
      commit: state.commit,
      exitCode,
      receiptPath,
      tree: state.tree,
    };
  } finally {
    await rm(lockPath, { force: true });
  }
}

export { successfulReceipt };

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const result = await runCandidateGate();
    console.log(`Candidate-gate receipt: ${result.receiptPath}`);
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

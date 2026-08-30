import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  linuxProcessStart,
  processStartIdentity,
  runCandidateGate,
} from '../candidate-gate.mjs';
import { verifyCandidateReceipt } from '../verify-candidate-receipt.mjs';

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
}

test('Linux lock identity uses procfs without an external ps command', () => {
  const stat = '123 (candidate gate) S 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 424242 20';
  assert.equal(linuxProcessStart(stat), 'linux-proc:424242');
  assert.equal(linuxProcessStart('malformed'), null);
});

async function candidateRepository(t, candidateGate) {
  const root = await mkdtemp(join(tmpdir(), 'icm-gate-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  git(root, ['init']);
  git(root, ['config', 'user.email', 'icm@example.invalid']);
  git(root, ['config', 'user.name', 'ICM Test']);
  await writeFile(join(root, 'candidate.txt'), 'candidate\n');
  await writeFile(join(root, 'icm.config.json'), `${JSON.stringify({
    schemaVersion: 1,
    candidateGate,
  }, null, 2)}\n`);
  git(root, ['add', '.']);
  git(root, ['commit', '-m', 'candidate']);
  return root;
}

test('candidate success requires only evidence declared by configuration', async (t) => {
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'repository-proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
    evidence: [],
  });

  const result = await runCandidateGate({ cwd: root });
  assert.equal(result.exitCode, 0);
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.deepEqual(receipt.evidence, {});
  assert.deepEqual(receipt.environment, {});
  assert.deepEqual(receipt.phases.map(({ name }) => name), ['repository-proof']);
  assert.doesNotMatch(JSON.stringify(receipt), /playwright|storefront|admin|api/i);
  assert.equal(result.receiptPath.startsWith(git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir'])), true);

  const verified = await verifyCandidateReceipt({ cwd: root });
  assert.equal(verified.tree, git(root, ['rev-parse', 'HEAD^{tree}']));
});

test('candidate gate is unavailable until setup configures it', async (t) => {
  const root = await candidateRepository(t, {
    enabled: false,
    requireLinkedWorktree: false,
    phases: [],
    evidence: [],
  });
  await assert.rejects(
    runCandidateGate({ cwd: root }),
    /disabled until repository commands are configured/,
  );
});

test('candidate gate rejects non-boolean enablement and duplicate probes', async (t) => {
  const root = await candidateRepository(t, {
    enabled: 'false',
    requireLinkedWorktree: false,
    phases: [],
    evidence: [],
    environmentProbes: ['platform', 'platform'],
  });
  await assert.rejects(runCandidateGate({ cwd: root }), /enabled must be a boolean.*unique supported probe names/);
});

test('configured evidence is required and recorded generically', async (t) => {
  const evidenceScript = [
    "const fs = require('node:fs');",
    "fs.writeFileSync(process.env.ICM_TEST_REPORT_PATH, JSON.stringify({proof: 'focused'}));",
  ].join('');
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'focused', command: [process.execPath, '-e', evidenceScript] }],
    evidence: [{
      name: 'test-report',
      environmentVariable: 'ICM_TEST_REPORT_PATH',
      required: true,
    }],
  });
  const result = await runCandidateGate({ cwd: root });
  assert.equal(result.exitCode, 0);
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.deepEqual(receipt.evidence, { 'test-report': { proof: 'focused' } });
});

test('runtime identity is recorded only when configured', async (t) => {
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
    evidence: [],
    environmentProbes: ['node-version'],
  });
  const result = await runCandidateGate({ cwd: root });
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.deepEqual(receipt.environment, { 'node-version': process.version });
});

test('malformed configured evidence produces a failure receipt', async (t) => {
  const evidenceScript = [
    "const fs = require('node:fs');",
    "fs.writeFileSync(process.env.ICM_REPORT_PATH, '{not-json');",
  ].join('');
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'proof', command: [process.execPath, '-e', evidenceScript] }],
    evidence: [{
      name: 'report',
      environmentVariable: 'ICM_REPORT_PATH',
      required: true,
    }],
    environmentProbes: [],
  });

  const result = await runCandidateGate({ cwd: root });
  assert.equal(result.exitCode, 1);
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.equal(receipt.result.status, 'failure');
  assert.match(receipt.result.reason, /evidence report is invalid JSON/);
});

test('candidate gate refuses dirty state and optionally requires a linked worktree', async (t) => {
  const dirtyRoot = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
    evidence: [],
  });
  await writeFile(join(dirtyRoot, 'untracked.txt'), 'dirty\n');
  await assert.rejects(runCandidateGate({ cwd: dirtyRoot }), /worktree is not clean/);

  const primaryRoot = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: true,
    phases: [{ name: 'proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
    evidence: [],
  });
  await assert.rejects(runCandidateGate({ cwd: primaryRoot }), /requires a linked worktree/);
});

test('candidate gate recovers only a provably stale local lock', async (t) => {
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
    evidence: [],
  });
  const receiptDirectory = join(
    git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir']),
    'icm-gate-receipts',
  );
  await mkdir(receiptDirectory, { recursive: true });
  const tree = git(root, ['rev-parse', 'HEAD^{tree}']);
  await writeFile(join(receiptDirectory, `${tree}.lock`), `${JSON.stringify({
    kind: 'icm-candidate-gate-lock',
    hostname: hostname(),
    pid: 999999,
    processStartedAt: 'not-running',
    tree,
    worktree: root,
  })}\n`);

  const result = await runCandidateGate({ cwd: root });
  assert.equal(result.exitCode, 0);
});

test('candidate gate records failures and verifier rejects them', async (t) => {
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [
      { name: 'failing-proof', command: [process.execPath, '-e', 'process.exit(7)'] },
      { name: 'later-proof', command: [process.execPath, '-e', 'process.exit(0)'] },
    ],
    evidence: [{
      name: 'failure-detail',
      environmentVariable: 'ICM_FAILURE_DETAIL_PATH',
      required: true,
    }],
  });

  const result = await runCandidateGate({ cwd: root });
  assert.equal(result.exitCode, 7);
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.deepEqual(receipt.result, {
    status: 'failure',
    exitCode: 7,
    reason: 'phase failing-proof failed',
  });
  assert.deepEqual(receipt.phases.map(({ name, status }) => ({ name, status })), [
    { name: 'failing-proof', status: 'failure' },
    { name: 'later-proof', status: 'skipped' },
  ]);
  assert.deepEqual(receipt.evidenceOmissions, [{
    name: 'failure-detail',
    required: true,
    reason: 'not recorded after a gate failure',
  }]);
  await assert.rejects(verifyCandidateReceipt({ cwd: root }), /no successful configured candidate-gate receipt/);
});

test('failed reruns retain immutable attempt receipts', async (t) => {
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'failure', command: [process.execPath, '-e', 'process.exit(2)'] }],
    evidence: [],
    environmentProbes: [],
  });
  const first = await runCandidateGate({ cwd: root });
  const second = await runCandidateGate({ cwd: root });
  assert.notEqual(first.attemptReceiptPath, second.attemptReceiptPath);
  const receiptDirectory = join(
    git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir']),
    'icm-gate-receipts',
  );
  const attempts = (await readdir(receiptDirectory)).filter((name) => name.includes('.attempt.'));
  assert.equal(attempts.length, 2);
});

test('candidate gate invalidates proof that changes the candidate tree', async (t) => {
  const mutationScript = [
    "const fs = require('node:fs');",
    "fs.writeFileSync('candidate.txt', 'changed during proof\\n');",
  ].join('');
  const root = await candidateRepository(t, {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'mutating-proof', command: [process.execPath, '-e', mutationScript] }],
    evidence: [],
  });

  const result = await runCandidateGate({ cwd: root });
  assert.equal(result.exitCode, 1);
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.equal(receipt.result.reason, 'candidate gate changed candidate state');
});

test('candidate gate rejects duplicate success and an active lock', async (t) => {
  const gate = {
    enabled: true,
    requireLinkedWorktree: false,
    phases: [{ name: 'proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
    evidence: [],
  };
  const duplicateRoot = await candidateRepository(t, gate);
  await runCandidateGate({ cwd: duplicateRoot });
  await assert.rejects(runCandidateGate({ cwd: duplicateRoot }), /already has a successful candidate-gate receipt/);

  const lockedRoot = await candidateRepository(t, gate);
  const receiptDirectory = join(
    git(lockedRoot, ['rev-parse', '--path-format=absolute', '--git-common-dir']),
    'icm-gate-receipts',
  );
  await mkdir(receiptDirectory, { recursive: true });
  const tree = git(lockedRoot, ['rev-parse', 'HEAD^{tree}']);
  const processStartedAt = await processStartIdentity(process.pid);
  await writeFile(join(receiptDirectory, `${tree}.lock`), `${JSON.stringify({
    kind: 'icm-candidate-gate-lock',
    hostname: hostname(),
    pid: process.pid,
    processStartedAt,
    tree,
    worktree: lockedRoot,
  })}\n`);
  await assert.rejects(runCandidateGate({ cwd: lockedRoot }), /already running/);
});

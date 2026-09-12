import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
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

async function candidateRepository(t, candidateGate, { linked = true } = {}) {
  const parent = await mkdtemp(join(tmpdir(), 'icm-gate-'));
  const root = join(parent, 'repository');
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(parent, { recursive: true })));
  await mkdir(root, { recursive: true });
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
  if (!linked) return root;
  const worktree = join(parent, 'candidate-worktree');
  git(root, ['worktree', 'add', '--detach', worktree, 'HEAD']);
  return worktree;
}

const successfulGate = () => ({
  enabled: true,
  phases: [{ name: 'repository-proof', command: [process.execPath, '-e', 'process.exit(0)'] }],
});

test('Linux lock identity uses procfs without an external ps command', () => {
  const stat = '123 (candidate gate) S 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 424242 20';
  assert.equal(linuxProcessStart(stat), 'linux-proc:424242');
  assert.equal(linuxProcessStart('malformed'), null);
});

test('candidate success records phase and runtime evidence for the current tree', async (t) => {
  const root = await candidateRepository(t, successfulGate());

  const result = await runCandidateGate({ cwd: root });
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));

  assert.equal(result.exitCode, 0);
  assert.deepEqual(receipt.phases.map(({ name, status }) => ({ name, status })), [
    { name: 'repository-proof', status: 'success' },
  ]);
  assert.equal(receipt.environment.node, process.version);
  assert.equal(receipt.environment.platform, process.platform);
  assert.equal(receipt.environment.architecture, process.arch);
  assert.equal(receipt.tree, git(root, ['rev-parse', 'HEAD^{tree}']));

  const verified = await verifyCandidateReceipt({ cwd: root });
  assert.equal(verified.tree, receipt.tree);
});

test('receipt verification rejects a different current tree', async (t) => {
  const root = await candidateRepository(t, successfulGate());
  await runCandidateGate({ cwd: root });
  await writeFile(join(root, 'later-change.txt'), 'new tree\n');
  git(root, ['add', '.']);
  git(root, ['commit', '-m', 'change candidate tree']);

  await assert.rejects(
    verifyCandidateReceipt({ cwd: root }),
    /no successful configured candidate-gate receipt/,
  );
});

test('candidate gate is unavailable until setup configures it', async (t) => {
  const root = await candidateRepository(t, { enabled: false, phases: [] });
  await assert.rejects(
    runCandidateGate({ cwd: root }),
    /disabled until repository commands are configured/,
  );
});

test('candidate gate configuration contains only enablement and named phases', async (t) => {
  const root = await candidateRepository(t, {
    enabled: false,
    phases: [],
    evidence: [],
  });
  await assert.rejects(runCandidateGate({ cwd: root }), /unknown key evidence/);
});

test('candidate gate refuses dirty state and the primary worktree', async (t) => {
  const dirtyRoot = await candidateRepository(t, successfulGate());
  await writeFile(join(dirtyRoot, 'untracked.txt'), 'dirty\n');
  await assert.rejects(runCandidateGate({ cwd: dirtyRoot }), /worktree is not clean/);

  const primaryRoot = await candidateRepository(t, successfulGate(), { linked: false });
  await assert.rejects(runCandidateGate({ cwd: primaryRoot }), /requires a linked worktree/);
});

test('candidate gate recovers only a provably stale local lock', async (t) => {
  const root = await candidateRepository(t, successfulGate());
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

test('candidate gate refuses a lock whose owner cannot be proven stale', async (t) => {
  const root = await candidateRepository(t, successfulGate());
  const receiptDirectory = join(
    git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir']),
    'icm-gate-receipts',
  );
  await mkdir(receiptDirectory, { recursive: true });
  const tree = git(root, ['rev-parse', 'HEAD^{tree}']);
  await writeFile(join(receiptDirectory, `${tree}.lock`), `${JSON.stringify({
    kind: 'icm-candidate-gate-lock',
    hostname: 'another-host',
    pid: 123,
    processStartedAt: 'unknown',
    tree,
    worktree: root,
  })}\n`);

  await assert.rejects(runCandidateGate({ cwd: root }), /belongs to another host/);
});

test('candidate gate records phase failures and verifier rejects them', async (t) => {
  const root = await candidateRepository(t, {
    enabled: true,
    phases: [
      { name: 'failing-proof', command: [process.execPath, '-e', 'process.exit(7)'] },
      { name: 'later-proof', command: [process.execPath, '-e', 'process.exit(0)'] },
    ],
  });

  const result = await runCandidateGate({ cwd: root });
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));

  assert.equal(result.exitCode, 7);
  assert.deepEqual(receipt.result, {
    status: 'failure',
    exitCode: 7,
    reason: 'phase failing-proof failed',
  });
  assert.deepEqual(receipt.phases.map(({ name, status }) => ({ name, status })), [
    { name: 'failing-proof', status: 'failure' },
    { name: 'later-proof', status: 'skipped' },
  ]);
  await assert.rejects(verifyCandidateReceipt({ cwd: root }), /no successful configured candidate-gate receipt/);
});

test('candidate gate invalidates proof that changes the candidate tree', async (t) => {
  const mutationScript = [
    "const fs = require('node:fs');",
    "fs.writeFileSync('candidate.txt', 'changed during proof\\n');",
  ].join('');
  const root = await candidateRepository(t, {
    enabled: true,
    phases: [{ name: 'mutating-proof', command: [process.execPath, '-e', mutationScript] }],
  });

  const result = await runCandidateGate({ cwd: root });
  const receipt = JSON.parse(await readFile(result.receiptPath, 'utf8'));
  assert.equal(result.exitCode, 1);
  assert.equal(receipt.result.reason, 'candidate gate changed candidate state');
});

test('candidate gate rejects duplicate success and an active lock', async (t) => {
  const duplicateRoot = await candidateRepository(t, successfulGate());
  await runCandidateGate({ cwd: duplicateRoot });
  await assert.rejects(
    runCandidateGate({ cwd: duplicateRoot }),
    /already has a successful candidate-gate receipt/,
  );

  const lockedRoot = await candidateRepository(t, successfulGate());
  const receiptDirectory = join(
    git(lockedRoot, ['rev-parse', '--path-format=absolute', '--git-common-dir']),
    'icm-gate-receipts',
  );
  await mkdir(receiptDirectory, { recursive: true });
  const tree = git(lockedRoot, ['rev-parse', 'HEAD^{tree}']);
  await writeFile(join(receiptDirectory, `${tree}.lock`), `${JSON.stringify({
    kind: 'icm-candidate-gate-lock',
    hostname: hostname(),
    pid: process.pid,
    processStartedAt: await processStartIdentity(process.pid),
    tree,
    worktree: lockedRoot,
  })}\n`);

  await assert.rejects(runCandidateGate({ cwd: lockedRoot }), /already running/);
});

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  driftContext,
  parseDrift,
  recordDrift,
} from '../drift-hook.mjs';

const scriptPath = resolve(dirname(fileURLToPath(import.meta.url)), '../drift-hook.mjs');

async function temporaryRoot(t) {
  const root = await mkdtemp(join(tmpdir(), 'icm-drift-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  return root;
}

test('recognizes only prompts that start with !drift', () => {
  assert.deepEqual(parseDrift('!drift'), { category: null });
  assert.deepEqual(parseDrift('  !drift Scope revived the rejected option'), { category: 'scope' });
  assert.equal(parseDrift('!drifted'), null);
  assert.equal(parseDrift('please !drift'), null);
  assert.equal(parseDrift('Fix the failing test'), null);
});

test('counts drift per session and keeps each category', async (t) => {
  const root = await temporaryRoot(t);
  const at = new Date('2026-10-28T12:00:00Z');

  await recordDrift(root, { session_id: 'claude-1', prompt: '!drift mocks' }, at);
  const counter = await recordDrift(root, { session_id: 'claude-1', prompt: '!drift' }, at);
  await recordDrift(root, { session_id: 'claude-2', prompt: '!drift' }, at);

  assert.equal(counter.count, 2);
  assert.deepEqual(counter.events, [
    { at: '2026-10-28T12:00:00.000Z', category: 'mocks' },
    { at: '2026-10-28T12:00:00.000Z', category: null },
  ]);
  assert.equal(driftContext(counter), 'drift: 2 this session');
  assert.deepEqual(
    JSON.parse(await readFile(join(root, '.icm/drift/claude-1.json'), 'utf8')),
    counter,
  );
  assert.deepEqual((await readdir(join(root, '.icm/drift'))).sort(), ['claude-1.json', 'claude-2.json']);
});

test('accepts alternate field names and keeps session files inside the drift folder', async (t) => {
  const root = await temporaryRoot(t);

  const counter = await recordDrift(root, { sessionId: '../escape', user_prompt: '!drift constraint' });

  assert.equal(driftContext(counter), 'drift: 1 this session (latest: constraint)');
  assert.deepEqual(await readdir(join(root, '.icm/drift')), ['__escape.json']);
});

test('leaves other prompts untouched', async (t) => {
  const root = await temporaryRoot(t);

  assert.equal(await recordDrift(root, { session_id: 'claude-1', prompt: 'Add the mock factory' }), null);
  await assert.rejects(readdir(join(root, '.icm')), { code: 'ENOENT' });
});

test('the hook prints nothing for other prompts', async () => {
  const run = (input) => new Promise((resolvePromise, reject) => {
    const child = execFile('node', [scriptPath], (error, stdout) => (
      error ? reject(error) : resolvePromise(stdout)
    ));
    child.stdin.end(JSON.stringify(input));
  });

  assert.equal(await run({ session_id: 'test-pass-through', prompt: 'hello' }), '');
});

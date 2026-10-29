import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

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
  assert.deepEqual(parseDrift('!drift'), { category: null, note: null });
  assert.deepEqual(parseDrift('  !drift Scope revived the rejected option'), {
    category: 'scope',
    note: 'revived the rejected option',
  });
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
  assert.deepEqual(counter.events.map(({ at: time, category }) => ({ time, category })), [
    { time: '2026-10-28T12:00:00.000Z', category: 'mocks' },
    { time: '2026-10-28T12:00:00.000Z', category: null },
  ]);
  assert.equal(driftContext(counter), 'drift: 2 this session');
  assert.deepEqual(
    JSON.parse(await readFile(join(root, '.icm/drift/claude-1.json'), 'utf8')),
    counter,
  );
  assert.deepEqual(
    (await readdir(join(root, '.icm/drift'))).sort(),
    ['claude-1', 'claude-1.json', 'claude-2', 'claude-2.json'],
  );
});

test('accepts alternate field names and keeps session files inside the drift folder', async (t) => {
  const root = await temporaryRoot(t);

  const counter = await recordDrift(root, { sessionId: '../escape', user_prompt: '!drift constraint' });

  assert.equal(driftContext(counter), 'drift: 1 this session (latest: constraint)');
  assert.deepEqual((await readdir(join(root, '.icm/drift'))).sort(), ['__escape', '__escape.json']);
});

test('bookmarks the note, git state, and a transcript copy for each drift', async (t) => {
  const root = await temporaryRoot(t);
  const project = await temporaryRoot(t);
  const git = (...args) => promisify(execFile)('git', ['-C', project, ...args]);
  await git('init', '-q', '-b', 'main');
  await writeFile(join(project, 'README.md'), 'project\n');
  await git('add', 'README.md');
  await git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'Start');
  const commit = (await git('rev-parse', 'HEAD')).stdout.trim();
  const transcript = join(project, 'session.jsonl');
  await writeFile(transcript, '{"turn":1}\n');

  const counter = await recordDrift(root, {
    session_id: 'claude-1',
    prompt: '!drift mocks hand-wrote the workflow mock again',
    cwd: project,
    transcript_path: transcript,
  });
  await writeFile(transcript, '{"turn":1}\n{"turn":2}\n');
  const missing = await recordDrift(root, {
    session_id: 'claude-1',
    prompt: '!drift',
    transcript_path: join(project, 'gone.jsonl'),
  });

  const [first] = counter.events;
  assert.equal(first.note, 'hand-wrote the workflow mock again');
  assert.equal(first.cwd, project);
  assert.deepEqual(first.git, { commit, branch: 'main', dirty: true });
  assert.equal(first.transcriptPath, transcript);
  assert.equal(first.transcriptSnapshot, '.icm/drift/claude-1/1.jsonl');
  assert.equal(await readFile(join(root, first.transcriptSnapshot), 'utf8'), '{"turn":1}\n');
  assert.equal(missing.events[1].transcriptSnapshot, null);
  assert.equal(missing.events[1].git, null);
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

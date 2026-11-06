import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import {
  driftContext,
  hookOutput,
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

// Runs a copy of the script in a scratch workspace so drift files land there,
// not in this repository's .icm folder.
async function runHookIn(t, input) {
  const root = await temporaryRoot(t);
  const copy = join(root, 'tools/icm/drift-hook.mjs');
  await mkdir(dirname(copy), { recursive: true });
  await copyFile(scriptPath, copy);
  const { stdout, stderr } = await new Promise((resolvePromise, reject) => {
    const child = execFile('node', [copy], (error, out, err) => (
      error ? reject(error) : resolvePromise({ stdout: out, stderr: err })
    ));
    child.stdin.end(JSON.stringify(input));
  });
  return { root, stdout, stderr };
}

test('echoes the incoming event name, defaulting to UserPromptSubmit', () => {
  const counter = { count: 1, events: [{ category: 'scope' }] };

  assert.equal(
    hookOutput({ hook_event_name: 'BeforeAgent' }, counter).hookSpecificOutput.hookEventName,
    'BeforeAgent',
  );
  assert.equal(
    hookOutput({ hook_event_name: 'UserPromptSubmit' }, counter).hookSpecificOutput.hookEventName,
    'UserPromptSubmit',
  );
  assert.equal(hookOutput({}, counter).hookSpecificOutput.hookEventName, 'UserPromptSubmit');
});

test('answers a Gemini CLI BeforeAgent input with only one JSON object on stdout', async (t) => {
  const transcriptDir = await temporaryRoot(t);
  const transcript = join(transcriptDir, 'session-1.json');
  await writeFile(transcript, '{"messages":[]}\n');

  const { root, stdout, stderr } = await runHookIn(t, {
    session_id: 'gemini-1',
    transcript_path: transcript,
    cwd: transcriptDir,
    hook_event_name: 'BeforeAgent',
    timestamp: '2026-11-06T12:00:00.000Z',
    prompt: '!drift scope reopened the settled option',
  });

  assert.equal(stderr, '');
  assert.match(stdout, /^\{.*\}\n$/s);
  assert.equal(stdout.trim().split('\n').length, 1);
  assert.deepEqual(JSON.parse(stdout), {
    hookSpecificOutput: {
      hookEventName: 'BeforeAgent',
      additionalContext: 'drift: 1 this session (latest: scope)',
    },
  });
  const saved = JSON.parse(await readFile(join(root, '.icm/drift/gemini-1.json'), 'utf8'));
  assert.equal(saved.events[0].transcriptSnapshot, '.icm/drift/gemini-1/1.json');
  assert.equal(await readFile(join(root, saved.events[0].transcriptSnapshot), 'utf8'), '{"messages":[]}\n');
});

test('a Gemini CLI prompt without !drift prints nothing', async (t) => {
  const { root, stdout } = await runHookIn(t, {
    session_id: 'gemini-1',
    hook_event_name: 'BeforeAgent',
    prompt: 'Add the mock factory',
  });

  assert.equal(stdout, '');
  await assert.rejects(readdir(join(root, '.icm')), { code: 'ENOENT' });
});

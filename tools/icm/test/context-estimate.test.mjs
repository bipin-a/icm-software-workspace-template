import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  estimateContext,
  estimateTokens,
} from '../estimate-context.mjs';

test('estimates prose and dense text conservatively', () => {
  assert.equal(estimateTokens('one two three four'), 6);
  assert.equal(estimateTokens('x'.repeat(40)), 10);
});

test('reports expected usage with the configured reserve', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-context-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await writeFile(join(root, 'icm.config.json'), `${JSON.stringify({
    schemaVersion: 1,
    context: { packetTokens: 100, reserveTokens: 10 },
  })}\n`);
  await writeFile(join(root, 'first.md'), 'one two three four\n');
  await writeFile(join(root, 'second.md'), 'x'.repeat(40));

  const report = await estimateContext(root, ['first.md', 'second.md']);

  assert.deepEqual(report.files, [
    { path: 'first.md', tokens: 6 },
    { path: 'second.md', tokens: 10 },
  ]);
  assert.deepEqual(report.summary, {
    contentTokens: 16,
    reserveTokens: 10,
    expectedTokens: 26,
    packetTokens: 100,
    headroomTokens: 74,
  });
});

test('requires explicit repository-local files', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-context-path-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await writeFile(join(root, 'icm.config.json'), `${JSON.stringify({
    schemaVersion: 1,
    context: { packetTokens: 100, reserveTokens: 10 },
  })}\n`);

  await assert.rejects(estimateContext(root, []), /provide at least one context file/i);
  await assert.rejects(estimateContext(root, ['../outside.md']), /must stay inside the repository/);
});

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { checkWorkspace } from '../../../../tools/icm/workspace-check.mjs';

const exec = promisify(execFile);
const git = (root, ...args) => exec('git', args, { cwd: root, encoding: 'utf8' });
const templateRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

async function createFeatureReviewFixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'icm-feature-review-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'projects/example'), { recursive: true });
  await git(root, 'init');
  await git(root, 'config', 'user.name', 'ICM Review Test');
  await git(root, 'config', 'user.email', 'icm-review@example.invalid');
  const brief = `---
type: project
id: example
title: Task filtering
decision_documents: [technical.md]
---
# Task filtering

## Intent
Help a user find incomplete tasks.

## Product behavior
Show task results with manual Refresh.

## Technical choices
[Technical owner](technical.md).

## Acceptance and proof
The task list agrees with the saved task state.

## Open questions
None.

## Links
Review is supplied by the caller from its actual source.
`;
  await writeFile(join(root, 'projects/example/PROJECT.md'), brief);
  await writeFile(join(root, 'projects/example/technical.md'), 'Reuse the task query.\n');
  // The core checker loads the kit's changed-check module from the repository under test.
  for (const path of ['tools/icm', 'extras/team-delivery/tools']) {
    await cp(join(templateRoot, path), join(root, path), { recursive: true });
  }
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'Reviewed feature decisions');
  const reviewedCommit = (await git(root, 'rev-parse', 'HEAD')).stdout.trim();
  return { root, brief, reviewedCommit };
}

test('changed checking includes staged, restored, untracked paths and incoming links', async (t) => {
  const { root, reviewedCommit } = await createFeatureReviewFixture(t);
  await writeFile(join(root, 'projects/example/technical.md'), 'Changed decision.\n');
  await git(root, 'add', '.');
  await writeFile(join(root, 'projects/example/technical.md'), 'Reuse the task query.\n');
  await writeFile(join(root, 'projects/example/new.md'), 'New evidence.\n');
  let result = await checkWorkspace(root, { changedSince: reviewedCommit });
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.scope.paths, ['projects/example/new.md', 'projects/example/technical.md']);
  await writeFile(join(root, 'projects/example/technical.md'), '[Deleted evidence](new.md)\n');
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'Add evidence');
  const base = (await git(root, 'rev-parse', 'HEAD')).stdout.trim();
  await rm(join(root, 'projects/example/new.md'));
  result = await checkWorkspace(root, { changedSince: base });
  assert.ok(result.scope.affected.includes('projects/example/technical.md'));
  assert.match(result.failures.join('\n'), /links to missing new.md/);
  await writeFile(join(root, 'unknown.txt'), 'Unknown impact');
  result = await checkWorkspace(root, { changedSince: base });
  assert.equal(result.scope.mode, 'workspace');
  assert.match((await checkWorkspace(root, { changedSince: base, projectSlug: 'example' })).failures.join('\n'), /cannot be combined/);
});

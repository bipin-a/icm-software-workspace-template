import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  checkContextBudgets,
  estimateTokens,
} from '../check-context-budget.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

async function write(root, path, body) {
  const target = join(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
}

test('estimates prose and dense text conservatively', () => {
  assert.equal(estimateTokens('one two three four'), 6);
  assert.equal(estimateTokens('x'.repeat(40)), 10);
});

test('the template context contracts fit their declared budgets', async () => {
  const result = await checkContextBudgets(repositoryRoot);
  assert.deepEqual(result.failures, []);
});

test('an undersized packet budget fails with the responsible contract', async () => {
  const config = JSON.parse(await readFile(resolve(repositoryRoot, 'icm.config.json'), 'utf8'));
  config.context.limits.packetTokens = 1;

  const result = await checkContextBudgets(repositoryRoot, { config });

  assert.ok(result.failures.some((failure) => (
    failure.includes('workflows/') && failure.includes('packet')
  )));
});

test('budget scenarios may use only selectors declared by their contract', async () => {
  const config = JSON.parse(await readFile(resolve(repositoryRoot, 'icm.config.json'), 'utf8'));
  config.context.budgetScenarios[0].selectors.push('_shared/not-declared.md');

  const result = await checkContextBudgets(repositoryRoot, { config });

  assert.ok(result.failures.some((failure) => failure.includes('undeclared selector')));
});

test('a packet cannot select a missing profile heading', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-budget-profile-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'icm.config.json', `${JSON.stringify({
    schemaVersion: 1,
    context: {
      commonPaths: [],
      limits: {
        hubTokens: 1000,
        routerTokens: 1000,
        stepTokens: 1000,
        packetTokens: 7000,
        reserveTokens: 500,
      },
      budgetScenarios: [],
    },
  })}\n`);
  await write(root, 'workflows/example/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/profile.md',
    '    heading: missing-profile',
    '---',
    '# Example',
  ].join('\n'));
  await write(root, '_shared/profile.md', '# Profiles\n\n## actual-profile\n');

  const result = await checkContextBudgets(root);

  assert.ok(result.failures.some((failure) => failure.includes('missing-profile')));
});

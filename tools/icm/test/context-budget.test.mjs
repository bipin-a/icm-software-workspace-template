import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  checkContextBudgets,
  estimateTokens,
} from '../check-context-budget.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

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

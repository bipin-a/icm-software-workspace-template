import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkWorkspace } from './workspace-check.mjs';

export * from './workspace-check.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const result = await checkWorkspace(repositoryRoot);
if (result.failures.length > 0) {
  console.error('ICM workspace check failed:');
  for (const failure of result.failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('ICM workspace check passed.');
}

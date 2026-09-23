import { readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SIZES, TEAM_ONLY_PATHS } from './workspace-check.mjs';

const CORE_TEST = 'node --test test/*.test.mjs';

async function readJson(root, path) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'));
}

async function writeJson(root, path, value) {
  await writeFile(resolve(root, path), `${JSON.stringify(value, null, 2)}\n`);
}

// Records the repository size. Solo is one-way: it deletes the team-only paths
// and every reference the core keeps to them.
export async function applySize(root, size) {
  if (!SIZES.includes(size)) throw new Error(`--size must be one of ${SIZES.join(', ')}`);
  const config = await readJson(root, 'icm.config.json');
  if (config.size === size) return { size, changed: [] };
  if (config.size !== undefined) throw new Error(`Size is already ${config.size}; it cannot change in place`);
  const changed = ['icm.config.json'];
  config.size = size;
  if (size === 'solo') {
    delete config.candidateGate;
    for (const path of TEAM_ONLY_PATHS) {
      await rm(resolve(root, path), { recursive: true, force: true });
      changed.push(path);
    }
    const hubPath = 'workflows/CONTEXT.md';
    const hub = await readFile(resolve(root, hubPath), 'utf8');
    await writeFile(resolve(root, hubPath), hub.replace(/^\| \[0[56]_[a-z-]+\]\(0[56]_[a-z-]+\/CONTEXT\.md\) \|.*\n/gm, ''));
    changed.push(hubPath);
    const packagePath = 'tools/icm/package.json';
    const toolPackage = await readJson(root, packagePath);
    delete toolPackage.scripts.delivery;
    toolPackage.scripts.test = CORE_TEST;
    await writeJson(root, packagePath, toolPackage);
    changed.push(packagePath);
  }
  await writeJson(root, 'icm.config.json', config);
  return { size, changed };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== '--size') throw new Error(`Usage: setup.mjs --size <${SIZES.join('|')}>`);
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
    const result = await applySize(root, args[1]);
    console.log(result.changed.length
      ? `Size set to ${result.size}. Changed: ${result.changed.join(', ')}. Run npm --prefix tools/icm run check.`
      : `Size is already ${result.size}; nothing changed.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

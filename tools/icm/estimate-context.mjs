import { readFile, realpath } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export function estimateTokens(body) {
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return Math.ceil(Math.max(words * 1.5, body.length / 4));
}

function repositoryPath(root, path) {
  return relative(root, path).split(sep).join('/');
}

function insideRepository(path) {
  return path !== '..' && !path.startsWith('../');
}

export async function estimateContext(root, paths) {
  if (paths.length === 0) throw new Error('Provide at least one context file.');

  const repositoryRoot = await realpath(root);
  const config = JSON.parse(await readFile(resolve(repositoryRoot, 'icm.config.json'), 'utf8'));
  const { packetTokens, reserveTokens } = config.context ?? {};
  if (
    config.schemaVersion !== 1
    || !Number.isFinite(packetTokens)
    || packetTokens < 0
    || !Number.isFinite(reserveTokens)
    || reserveTokens < 0
  ) {
    throw new Error('icm.config.json must define non-negative context packetTokens and reserveTokens.');
  }

  const files = [];
  for (const path of paths) {
    const requestedTarget = resolve(repositoryRoot, path);
    if (!insideRepository(repositoryPath(repositoryRoot, requestedTarget))) {
      throw new Error(`Context file ${path} must stay inside the repository.`);
    }
    const target = await realpath(requestedTarget);
    const scopedPath = repositoryPath(repositoryRoot, target);
    if (!insideRepository(scopedPath)) {
      throw new Error(`Context file ${path} must stay inside the repository.`);
    }
    files.push({
      path: scopedPath,
      tokens: estimateTokens(await readFile(target, 'utf8')),
    });
  }

  const contentTokens = files.reduce((total, file) => total + file.tokens, 0);
  const expectedTokens = contentTokens + reserveTokens;
  return {
    files,
    summary: {
      contentTokens,
      reserveTokens,
      expectedTokens,
      packetTokens,
      headroomTokens: packetTokens - expectedTokens,
    },
  };
}

function printReport(report) {
  for (const file of report.files) console.log(`${file.tokens}\t${file.path}`);
  console.log(`Content\t${report.summary.contentTokens}`);
  console.log(`Reserve\t${report.summary.reserveTokens}`);
  console.log(`Expected\t${report.summary.expectedTokens}`);
  console.log(`Limit\t${report.summary.packetTokens}`);
  console.log(`Headroom\t${report.summary.headroomTokens}`);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  try {
    printReport(await estimateContext(root, process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

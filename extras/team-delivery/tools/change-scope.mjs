import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);

export async function changedPaths(root, base) {
  const git = async args => (await exec('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })).stdout;
  const commit = (await git(['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`])).trim();
  const outputs = await Promise.all([
    git(['diff', '--name-only', '--no-renames', '-z', commit, 'HEAD', '--']),
    git(['diff', '--cached', '--name-only', '--no-renames', '-z', '--']),
    git(['diff', '--name-only', '--no-renames', '-z', '--']),
    git(['ls-files', '--others', '--exclude-standard', '-z']),
  ]);
  return { base: commit, paths: [...new Set(outputs.flatMap(output => output.split('\0').filter(Boolean)))].sort() };
}

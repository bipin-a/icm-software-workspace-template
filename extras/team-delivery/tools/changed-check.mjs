import { dirname, resolve } from 'node:path';
import {
  checkWorkspace,
  checkedProject,
  markdownLinkFailures,
  markdownLinkTargets,
  optionalRead,
  repositoryFiles,
  toRepositoryPath,
} from '../../../tools/icm/workspace-check.mjs';
import { changedPaths } from './change-scope.mjs';

// Loaded by the core checker only for --changed-since.
export async function changedWorkspaceChecks(repositoryRoot, base) {
  const changes = await changedPaths(repositoryRoot, base);
  // Shared contracts, tools, and unknown paths can affect any Project.
  if (changes.paths.some(path => !/^projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/.+\.md$/.test(path))) {
    const result = await checkWorkspace(repositoryRoot);
    return { ...result, scope: { ...changes, mode: 'workspace' } };
  }
  const files = await repositoryFiles(repositoryRoot, name => name.endsWith('.md'));
  const affected = new Set(changes.paths);
  const bodies = new Map(await Promise.all(files.map(async path => [path,
    await optionalRead(repositoryRoot, toRepositoryPath(repositoryRoot, path))])));
  let expanded;
  do {
    expanded = false;
    for (const [path, body] of bodies) {
      const source = toRepositoryPath(repositoryRoot, path);
      if (affected.has(source)) continue;
      if (markdownLinkTargets(path, body).some(link => affected.has(
        toRepositoryPath(repositoryRoot, resolve(dirname(path), link.target))))) {
        affected.add(source);
        expanded = true;
      }
    }
  } while (expanded);
  const selected = files.filter(path => affected.has(toRepositoryPath(repositoryRoot, path)));
  const failures = await markdownLinkFailures(repositoryRoot, repositoryRoot, selected);
  const projects = new Set([...affected].map(path => path.match(/^projects\/([^/]+)\//)?.[1]).filter(Boolean));
  for (const slug of projects) {
    const projectFiles = files.filter(path => toRepositoryPath(repositoryRoot, path).startsWith(`projects/${slug}/`));
    // A fully removed Project is allowed; retained consumers are still checked.
    if (projectFiles.length) {
      failures.push(...(await checkedProject(repositoryRoot, slug)).failures);
      failures.push(...await markdownLinkFailures(repositoryRoot, repositoryRoot, projectFiles));
    }
  }
  return { failures: [...new Set(failures)], scope: { ...changes, mode: 'changed', affected: [...affected].sort() } };
}

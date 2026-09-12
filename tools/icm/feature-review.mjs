import { execFile } from 'node:child_process';
import { readFile, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { parseFrontmatter, headingSection } from './markdown.mjs';

const execFileAsync = promisify(execFile);
export const FEATURE_WORKFLOW = 'feature-work';
export const BRIEF_HEADINGS = ['Intent', 'Product behavior', 'Technical choices', 'Acceptance and proof', 'Open questions', 'Links'];
const approvalFields = ['reviewed', 'approved', 'status', 'approval_contract', 'review_contract'];

export function briefStructureFailures(path, body, { requireContent = true } = {}) {
  const failures = [];
  const headings = [...body.matchAll(/^(#{1,6}) (.+)$/gm)];
  for (const heading of BRIEF_HEADINGS) {
    const matching = headings.filter(match => match[2] === heading || match[2].startsWith(`${heading} —`));
    if (matching.some(match => match[1] !== '##')) failures.push(`${path} must use ## ${heading}`);
    if (matching.length > 1) failures.push(`${path} repeats ## ${heading}`);
    if (!matching.length && !requireContent) failures.push(`${path} is missing ## ${heading}`);
    const section = headingSection(body, heading);
    if (requireContent && !section?.split('\n').slice(1).join('\n').replace(/<!--[\s\S]*?-->/g, '').trim()) {
      failures.push(`${path} needs content under ## ${heading}`);
    }
  }
  return failures;
}

function metadata(body, path) {
  const value = parseFrontmatter(path, body);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} needs mapping frontmatter`);
  return value;
}

function decisionPaths(project, root) {
  const declared = project.decision_documents ?? [];
  if (!Array.isArray(declared)) throw new Error(`${root}/PROJECT.md decision_documents must be a list`);
  const paths = ['PROJECT.md', ...declared];
  if (new Set(paths).size !== paths.length) throw new Error(`${root}/PROJECT.md repeats a decision document`);
  for (const path of paths) {
    if (typeof path !== 'string' || !path.endsWith('.md') || isAbsolute(path)
      || /[\\:\0\r\n]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) {
      throw new Error(`${root}/PROJECT.md has an invalid decision document path: ${path}`);
    }
  }
  return paths.map(path => `${root}/${path}`);
}

async function currentDocument(repositoryRoot, root, path) {
  try {
    const [projectRoot, file] = await Promise.all([
      realpath(resolve(repositoryRoot, root)), realpath(resolve(repositoryRoot, path)),
    ]);
    const inside = relative(projectRoot, file);
    const fromRepository = relative(await realpath(repositoryRoot), file);
    if (!inside || inside.startsWith('..') || isAbsolute(inside)
      || fromRepository.startsWith('..') || isAbsolute(fromRepository)) {
      throw new Error(`Decision document leaves Project: ${path}`);
    }
    return await readFile(file, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

// Structural validation and exact comparison only. The live review source owns
// authority and editorial dispositions; content equality cannot establish either.
export async function featureProjectChecks(repositoryRoot, projectSlug, { reviewedCommit } = {}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectSlug)) throw new Error(`Invalid Project slug: ${projectSlug}`);
  const root = `projects/${projectSlug}`;
  const path = `${root}/PROJECT.md`;
  const failures = [];
  const brief = await currentDocument(repositoryRoot, root, path);
  if (brief === null) return { failures: [`Missing feature brief: ${path}`] };
  const project = metadata(brief, path);
  if (project.type !== 'project' || project.workflow !== FEATURE_WORKFLOW) {
    failures.push(`${path} must declare type: project and workflow: ${FEATURE_WORKFLOW}`);
  }
  if (project.id !== projectSlug) failures.push(`${path} id must match ${projectSlug}`);
  if (typeof project.title !== 'string' || !project.title.trim()) failures.push(`${path} needs a title`);
  for (const field of approvalFields) {
    if (Object.hasOwn(project, field)) failures.push(`${path} must not store ${field}; use the live review source and revision comparison`);
  }
  failures.push(...briefStructureFailures(path, brief));
  const paths = decisionPaths(project, root);
  const current = new Map();
  for (const document of paths) {
    const body = document === path ? brief : await currentDocument(repositoryRoot, root, document);
    current.set(document, body);
    if (body === null) failures.push(`Missing decision document: ${document}`);
    else if (document !== path && /^---\r?\n/.test(body)) {
      const fields = metadata(body, document);
      for (const field of approvalFields) {
        if (Object.hasOwn(fields, field)) failures.push(`${document} must not store ${field}; use the live review source and revision comparison`);
      }
    }
  }
  if (!reviewedCommit) return { failures };
  if (!/^[0-9a-f]{40}$/.test(reviewedCommit)) throw new Error('--reviewed-commit needs the full commit SHA from the review source');
  const git = async args => (await execFileAsync('git', args, { cwd: repositoryRoot, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })).stdout;
  await git(['rev-parse', '--verify', '--end-of-options', `${reviewedCommit}^{commit}`]);
  const reviewedFiles = new Set((await git(['ls-tree', '-r', '--name-only', '-z', reviewedCommit, '--', root])).split('\0').filter(Boolean));
  if (!reviewedFiles.has(path)) throw new Error(`${path} did not exist at reviewed commit ${reviewedCommit}`);
  const reviewedBrief = await git(['show', `${reviewedCommit}:${path}`]);
  const previous = metadata(reviewedBrief, path);
  if (previous.workflow !== FEATURE_WORKFLOW) throw new Error('Workflow adaptation needs an explicit review; the reviewed commit is not feature-work');
  const previousPaths = decisionPaths(previous, root);
  for (const document of previousPaths) {
    if (!reviewedFiles.has(document)) throw new Error(`Reviewed decision document is missing at ${reviewedCommit}: ${document}`);
  }
  const indexEntries = (await git(['ls-files', '--stage', '-z', '--', root])).split('\0').filter(Boolean);
  const indexedFiles = new Set();
  for (const entry of indexEntries) {
    const match = entry.match(/^\d+ [0-9a-f]+ ([0-3])\t([\s\S]+)$/);
    if (!match || match[1] !== '0') throw new Error(`Resolve the unmerged Project index before comparing review: ${root}`);
    indexedFiles.add(match[2]);
  }
  const indexedBrief = indexedFiles.has(path) ? await git(['show', `:${path}`]) : null;
  const indexedPaths = indexedBrief === null ? [] : decisionPaths(metadata(indexedBrief, path), root);
  const allPaths = new Set([...paths, ...previousPaths, ...indexedPaths]);
  const changed = [];
  for (const document of allPaths) {
    const before = reviewedFiles.has(document) ? await git(['show', `${reviewedCommit}:${document}`]) : null;
    const after = current.has(document) ? current.get(document) : await currentDocument(repositoryRoot, root, document);
    const staged = indexedFiles.has(document) ? await git(['show', `:${document}`]) : null;
    if (before !== after || before !== staged) changed.push(document);
  }
  if (changed.length) failures.push(`Decision documents changed since ${reviewedCommit}; review or record a specific editorial disposition: ${changed.join(', ')}`);
  return { failures, comparison: { reviewedCommit, changed, status: changed.length ? 'needs-review' : 'matches-reviewed-revision' } };
}

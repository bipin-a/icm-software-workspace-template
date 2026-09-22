import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { candidateGateConfigurationErrors } from './config.mjs';
import { parseFrontmatter, headingSection } from './markdown.mjs';
import { briefStructureFailures, FEATURE_WORKFLOW, featureProjectChecks } from './feature-review.mjs';

async function optionalRead(root, path) {
  if (typeof path !== 'string' || path.length === 0) return null;
  const resolvedRoot = await realpath(root);
  const lexicalTarget = resolve(resolvedRoot, path);
  const lexicalRelative = toRepositoryPath(resolvedRoot, lexicalTarget);
  if (lexicalRelative === '..' || lexicalRelative.startsWith('../')) {
    throw new Error(`${path} resolves outside the repository`);
  }
  try {
    const resolvedTarget = await realpath(lexicalTarget);
    const resolvedRelative = toRepositoryPath(resolvedRoot, resolvedTarget);
    if (resolvedRelative === '..' || resolvedRelative.startsWith('../')) {
      throw new Error(`${path} resolves outside the repository through a symlink`);
    }
    return await readFile(resolvedTarget, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function profileRuleSelections(repositoryRoot, profilePath, profileSection) {
  return profileSection.split(/\r?\n/).flatMap((line) => {
    if (!line.trim().startsWith('|')) return [];
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
    const target = cells[0]?.match(/\]\(([^)]+)\)/)?.[1];
    let selection = cells[1] ?? '';
    if (/^Conditional\b/.test(selection)) selection = selection.slice(selection.indexOf(':') + 1);
    const headings = [...selection.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    if (!target || headings.length === 0) return [];
    const sourcePath = toRepositoryPath(
      repositoryRoot,
      resolve(dirname(resolve(repositoryRoot, profilePath)), target),
    );
    return [{ sourcePath, headings }];
  });
}

function markdownTableColumns(body, heading) {
  const section = headingSection(body, heading);
  if (!section) return null;
  const line = section.split(/\r?\n/).find((candidate) => candidate.trim().startsWith('|'));
  if (!line) return null;
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

export function isSafeRepositoryPath(path) {
  return typeof path === 'string'
    && path.length > 0
    && !path.startsWith('/')
    && !/^[A-Za-z]:[\\/]/.test(path)
    && !path.includes('\\')
    && !path.includes('//')
    && !path.split('/').some((part) => part === '.' || part === '..');
}

export function contextManifestFailures(scope, metadata) {
  if (metadata.type === 'workflow-hub' || metadata.type === 'workflow-router') {
    return metadata.context ? [`${scope} ${metadata.type} must not declare a context manifest`] : [];
  }
  if (metadata.type !== 'workflow-step') return [`${scope} has unknown workflow contract type ${metadata.type || 'missing'}`];
  const context = metadata.context;
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return [`${scope} is missing its context manifest`];
  }
  const failures = [];
  const allowedKeys = new Set([
    'parameters',
    'capabilities',
    'profile',
    'inputs',
    'selectors',
    'references',
    'output_templates',
    'tools',
  ]);
  for (const key of Object.keys(context)) {
    if (!allowedKeys.has(key)) failures.push(`${scope} context declares unknown key ${key}`);
  }
  for (const key of ['parameters', 'capabilities']) {
    if (
      context[key] !== undefined
      && (!Array.isArray(context[key]) || context[key].some((value) => typeof value !== 'string'))
    ) failures.push(`${scope} context ${key} must be a list of strings`);
  }
  if (!context.profile?.path || !context.profile?.heading) {
    failures.push(`${scope} must name one exact profile path and heading`);
  } else if (!isSafeRepositoryPath(context.profile.path)) {
    failures.push(`${scope} has an invalid profile path ${context.profile.path}`);
  }
  const categories = [
    ['input', context.inputs ?? []],
    ['selector', context.selectors ?? []],
    ['reference', context.references ?? []],
    ['output template', context.output_templates ?? []],
    ['tool', context.tools ?? []],
  ];
  const seenPaths = new Set();
  for (const [kind, entries] of categories) {
    if (!Array.isArray(entries)) {
      failures.push(`${scope} context ${kind}s must be a list`);
      continue;
    }
    for (const entry of entries) {
      if (!entry?.path || !isSafeRepositoryPath(entry.path)) {
        failures.push(`${scope} has an invalid ${kind} path ${entry?.path || 'missing'}`);
        continue;
      }
      if (seenPaths.has(entry.path)) failures.push(`${scope} repeats context path ${entry.path}`);
      seenPaths.add(entry.path);
      if (kind === 'selector' && (typeof entry.when !== 'string' || entry.when.trim() === '')) {
        failures.push(`${scope} selector ${entry.path} must declare when`);
      }
      if (kind === 'tool' && entry.access !== 'execute-only') {
        failures.push(`${scope} tool ${entry.path} must declare execute-only access`);
      }
      if (
        entry.headings !== undefined
        && (!Array.isArray(entry.headings) || entry.headings.some((heading) => typeof heading !== 'string'))
      ) failures.push(`${scope} ${kind} ${entry.path} headings must be a list of strings`);
      if (entry.tables !== undefined && !Array.isArray(entry.tables)) {
        failures.push(`${scope} ${kind} ${entry.path} tables must be a list`);
      }
      for (const table of Array.isArray(entry.tables) ? entry.tables : []) {
        if (typeof table?.heading !== 'string' || table.heading.trim() === '') {
          failures.push(`${scope} ${kind} ${entry.path} has a table without a heading`);
        }
        if (
          table.columns !== undefined
          && (!Array.isArray(table.columns) || table.columns.some((column) => typeof column !== 'string'))
        ) failures.push(`${scope} ${kind} ${entry.path} table columns must be a list of strings`);
        if (
          table.values !== undefined
          && (!Array.isArray(table.values) || table.values.some((value) => typeof value !== 'string'))
        ) failures.push(`${scope} ${kind} ${entry.path} table values must be a list of strings`);
        if (table.match !== undefined && !['prefix', 'contains', 'row-contains'].includes(table.match)) {
          failures.push(`${scope} ${kind} ${entry.path} has unsupported table match ${table.match}`);
        }
        if (table.exactly !== undefined && (!Number.isInteger(table.exactly) || table.exactly < 0)) {
          failures.push(`${scope} ${kind} ${entry.path} table exactly must be a non-negative integer`);
        }
      }
    }
  }
  const projectInputs = Array.isArray(context.inputs)
    ? context.inputs.filter((entry) => entry?.path === 'projects/<project-slug>/PROJECT.md')
    : [];
  if (projectInputs.length !== 1) failures.push(`${scope} must declare PROJECT.md exactly once`);
  return failures;
}

async function repositoryFiles(directory, predicate) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  const paths = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) paths.push(...await repositoryFiles(path, predicate));
    else if (entry.isFile() && predicate(entry.name)) paths.push(path);
  }
  return paths;
}

const toRepositoryPath = (repositoryRoot, path) => relative(repositoryRoot, path).split(sep).join('/');

function markdownLinkTargets(path, body) {
  return [...body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].flatMap((match) => {
    let target = match[1].trim();
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
    if (/^(?:https?:|mailto:|#)/.test(target)) return [];
    target = target.split('#')[0].split('?')[0];
    if (!target || target.includes('<') || target.includes('{')) return [];
    try {
      return [{ source: path, target: decodeURIComponent(target) }];
    } catch {
      return [{ source: path, target }];
    }
  });
}

async function markdownLinkFailures(repositoryRoot, scope = repositoryRoot) {
  const failures = [];
  const files = await repositoryFiles(scope, (name) => name.endsWith('.md'));
  for (const path of files) {
    const body = await optionalRead(repositoryRoot, toRepositoryPath(repositoryRoot, path));
    for (const link of markdownLinkTargets(path, body)) {
      const target = resolve(dirname(path), link.target);
      const repositoryPath = toRepositoryPath(repositoryRoot, path);
      const targetPath = toRepositoryPath(repositoryRoot, target);
      if (targetPath === '..' || targetPath.startsWith('../')) {
        failures.push(`${repositoryPath} links outside the repository to ${link.target}`);
        continue;
      }
      try {
        const resolvedTarget = await realpath(target);
        const resolvedRelative = toRepositoryPath(await realpath(repositoryRoot), resolvedTarget);
        if (resolvedRelative === '..' || resolvedRelative.startsWith('../')) {
          failures.push(`${repositoryPath} links outside the repository to ${link.target}`);
        }
      } catch (error) {
        if (error?.code === 'ENOENT') {
          failures.push(`${repositoryPath} links to missing ${link.target}`);
        } else {
          throw error;
        }
      }
    }
  }
  return failures;
}

const PROJECT_TEMPLATE_PATHS = new Map([
  ['projects/<project-slug>/PROJECT.md', '_templates/project/PROJECT.md'],
]);

function manifestSourcePath(path) {
  if (PROJECT_TEMPLATE_PATHS.has(path)) return PROJECT_TEMPLATE_PATHS.get(path);
  if (path.includes('<') || path.includes('{')) return null;
  return path;
}

async function manifestTargetFailures(repositoryRoot, scope, metadata) {
  if (metadata.type !== 'workflow-step' || !metadata.context) return [];
  const failures = [];
  const profile = metadata.context.profile;
  const profileBody = profile?.path && isSafeRepositoryPath(profile.path)
    ? await optionalRead(repositoryRoot, profile.path)
    : null;
  if (profile?.path && !profileBody) {
    failures.push(`${scope} profile path ${profile.path} does not exist`);
  } else if (profileBody && !headingSection(profileBody, profile.heading)) {
    failures.push(`${scope} profile heading ${profile.heading} does not exist in ${profile.path}`);
  } else if (profileBody) {
    const profileSection = headingSection(profileBody, profile.heading);
    for (const selection of profileRuleSelections(
      repositoryRoot,
      profile.path,
      profileSection,
    )) {
      const sourceBody = await optionalRead(repositoryRoot, selection.sourcePath);
      if (!sourceBody) {
        failures.push(`${scope} profile source ${selection.sourcePath} does not exist`);
        continue;
      }
      for (const heading of selection.headings) {
        if (!headingSection(sourceBody, heading)) {
          failures.push(`${scope} profile source ${selection.sourcePath} is missing ${heading}`);
        }
      }
    }
  }

  const categories = [
    ['input', metadata.context.inputs ?? []],
    ['selector', metadata.context.selectors ?? []],
    ['reference', metadata.context.references ?? []],
    ['output template', metadata.context.output_templates ?? []],
    ['tool', metadata.context.tools ?? []],
  ];
  for (const [kind, entries] of categories) {
    for (const entry of Array.isArray(entries) ? entries : []) {
      if (!entry?.path) continue;
      const sourcePath = manifestSourcePath(entry.path);
      if (!sourcePath) continue;
      const body = await optionalRead(repositoryRoot, sourcePath);
      if (!body) {
        failures.push(`${scope} ${kind} path ${entry.path} has no source at ${sourcePath}`);
        continue;
      }
      for (const heading of Array.isArray(entry.headings) ? entry.headings : []) {
        if (!headingSection(body, heading)) {
          failures.push(`${scope} ${sourcePath} is missing selected heading ${heading}`);
        }
      }
      for (const table of Array.isArray(entry.tables) ? entry.tables : []) {
        if (!table?.heading) continue;
        const columns = markdownTableColumns(body, table.heading);
        if (!columns) {
          failures.push(`${scope} ${sourcePath} is missing selected table ${table.heading}`);
          continue;
        }
        const missing = (Array.isArray(table.columns) ? table.columns : [])
          .filter((column) => !columns.includes(column));
        if (missing.length > 0) {
          failures.push(`${scope} ${sourcePath} table ${table.heading} is missing columns ${missing.join(', ')}`);
        }
      }
    }
  }
  return failures;
}

async function configurationFailures(repositoryRoot, config, configPresent) {
  if (!configPresent) return ['icm.config.json is required'];
  const failures = [];
  if (config.schemaVersion !== 1) {
    failures.push('icm.config.json must declare schemaVersion 1');
    return failures;
  }
  const contextIsObject = config.context
    && typeof config.context === 'object'
    && !Array.isArray(config.context);
  if (!contextIsObject) failures.push('icm.config.json context must be an object');
  const context = contextIsObject ? config.context : {};
  for (const name of ['packetTokens', 'reserveTokens']) {
    if (!Number.isFinite(context[name]) || context[name] < 0) {
      failures.push(`icm.config.json context ${name} must be a non-negative number`);
    }
  }
  for (const failure of candidateGateConfigurationErrors(config.candidateGate)) {
    failures.push(`icm.config.json candidateGate ${failure}`);
  }
  return failures;
}

async function workflowReachabilityFailures(repositoryRoot, contextPaths) {
  const failures = [];
  const known = new Set(contextPaths.map((path) => toRepositoryPath(repositoryRoot, path)));
  const hub = 'workflows/CONTEXT.md';
  if (!known.has(hub)) return [`${hub} is missing`];
  const edges = new Map();
  for (const path of contextPaths) {
    const source = toRepositoryPath(repositoryRoot, path);
    const body = await readFile(path, 'utf8');
    const targets = [];
    for (const link of markdownLinkTargets(path, body)) {
      let target = resolve(dirname(path), link.target);
      try {
        if ((await stat(target)).isDirectory()) target = join(target, 'CONTEXT.md');
      } catch {
        continue;
      }
      const relativeTarget = toRepositoryPath(repositoryRoot, target);
      if (known.has(relativeTarget)) targets.push(relativeTarget);
    }
    edges.set(source, targets);
  }
  const reachable = new Set([hub]);
  const queue = [hub];
  while (queue.length > 0) {
    const source = queue.shift();
    for (const target of edges.get(source) ?? []) {
      if (reachable.has(target)) continue;
      reachable.add(target);
      queue.push(target);
    }
  }
  for (const path of known) {
    if (!reachable.has(path)) failures.push(`${path} is unreachable from ${hub}`);
  }
  return failures;
}

const ROOT_ROUTES = [
  'setup/CONTEXT.md',
  'projects/CONTEXT.md',
  'workflows/CONTEXT.md',
  '_shared/CONTEXT.md',
  'roadmap/CONTEXT.md',
  'architecture/CONTEXT.md',
  'app/README.md',
];

async function humanCallFailures(repositoryRoot) {
  const failures = [];
  const canonical = '.agents/skills/human-call/SKILL.md';
  const adapter = '.claude/skills/human-call/SKILL.md';
  for (const path of [canonical, adapter]) {
    const body = await optionalRead(repositoryRoot, path);
    if (!body) {
      failures.push(`${path} is required`);
      continue;
    }
    try {
      const metadata = parseFrontmatter(path, body);
      if (metadata.name !== 'human-call') failures.push(`${path} must declare name: human-call`);
      if (typeof metadata.description !== 'string' || !metadata.description.trim()) {
        failures.push(`${path} must describe when to use the skill`);
      }
    } catch (error) {
      failures.push(error.message);
    }
  }
  for (const path of [adapter, '_shared/engineering/decision-work.md', '_shared/engineering/safeguards.md']) {
    const body = await optionalRead(repositoryRoot, path);
    const source = resolve(repositoryRoot, path);
    const linksCanonical = markdownLinkTargets(source, body ?? '').some(link =>
      resolve(dirname(source), link.target) === resolve(repositoryRoot, canonical));
    if (!linksCanonical) failures.push(`${path} must link to the canonical ${canonical}`);
  }
  return failures;
}

async function rootRouteFailures(repositoryRoot) {
  const failures = [];
  const rootBody = await optionalRead(repositoryRoot, 'CONTEXT.md');
  if (!rootBody) return ['CONTEXT.md is required as the workspace entry route'];
  const linkedTargets = new Set(markdownLinkTargets(
    resolve(repositoryRoot, 'CONTEXT.md'),
    rootBody,
  ).map((link) => toRepositoryPath(
    repositoryRoot,
    resolve(repositoryRoot, link.target),
  )));
  for (const route of ROOT_ROUTES) {
    if (!linkedTargets.has(route)) failures.push(`CONTEXT.md must link directly to ${route}`);
  }

  const agentBody = await optionalRead(repositoryRoot, 'AGENTS.md');
  if (!agentBody) return [...failures, 'AGENTS.md is required as the agent entry route'];
  for (const route of [
    'setup/questionnaire.md',
    'CONTEXT.md',
    '_shared/engineering/profiles/direct-repository.md#direct-repository',
  ]) {
    if (!agentBody.includes(route)) failures.push(`AGENTS.md must name ${route}`);
  }
  return failures;
}

function workflowContractShapeFailures(scope, body, type) {
  const markers = {
    'workflow-step': ['One job:', '## Inputs', 'Do not load', '## Process', '## Outputs', '## Human check'],
    'workflow-router': ['One job:', '## Inputs', 'Do not load', '## Routes'],
    'workflow-hub': ['One job:', '## Project path binding', '## Human check'],
  }[type] ?? [];
  return markers
    .filter((marker) => !body.includes(marker))
    .map((marker) => `${scope} is missing required contract marker ${marker}`);
}

async function workflowFailures(repositoryRoot) {
  const failures = [];
  const root = join(repositoryRoot, 'workflows');
  const contextPaths = await repositoryFiles(root, (name) => name === 'CONTEXT.md');
  for (const path of contextPaths) {
    const relativePath = toRepositoryPath(repositoryRoot, path);
    const body = await readFile(path, 'utf8');
    let metadata;
    try {
      metadata = parseFrontmatter(relativePath, body);
    } catch (error) {
      failures.push(error.message);
      continue;
    }
    failures.push(...contextManifestFailures(relativePath, metadata));
    failures.push(...workflowContractShapeFailures(relativePath, body, metadata.type));
    failures.push(...await manifestTargetFailures(repositoryRoot, relativePath, metadata));
  }
  failures.push(...await workflowReachabilityFailures(repositoryRoot, contextPaths));
  return failures;
}

async function checkWorkspaceInternal(repositoryRoot, { projectSlug, reviewedCommit } = {}) {
  if (reviewedCommit && !projectSlug) throw new Error('--reviewed-commit requires --project');
  if (projectSlug) {
    const result = await featureProjectChecks(repositoryRoot, projectSlug, { reviewedCommit });
    result.failures.push(...await markdownLinkFailures(repositoryRoot, join(repositoryRoot, 'projects', projectSlug)));
    return result;
  }
  const configBody = await optionalRead(repositoryRoot, 'icm.config.json');
  const config = configBody ? JSON.parse(configBody) : {};
  const failures = await configurationFailures(repositoryRoot, config, Boolean(configBody));
  failures.push(...await markdownLinkFailures(repositoryRoot));
  failures.push(...await rootRouteFailures(repositoryRoot));
  failures.push(...await humanCallFailures(repositoryRoot));
  failures.push(...await workflowFailures(repositoryRoot));
  const templatePath = '_templates/project/PROJECT.md';
  const template = await optionalRead(repositoryRoot, templatePath);
  if (!template) failures.push(`${templatePath} is required`);
  else {
    const metadata = parseFrontmatter(templatePath, template);
    if (metadata.type !== 'project' || metadata.workflow !== FEATURE_WORKFLOW) {
      failures.push(`${templatePath} must declare type: project and workflow: feature-work`);
    }
    failures.push(...briefStructureFailures(templatePath, template, { requireContent: false }));
  }
  const briefs = await repositoryFiles(join(repositoryRoot, 'projects'), name => name === 'PROJECT.md');
  for (const path of briefs) {
    const slug = relative(join(repositoryRoot, 'projects'), dirname(path)).split(sep).join('/');
    failures.push(...(await featureProjectChecks(repositoryRoot, slug)).failures);
  }
  return { failures };
}

export async function checkWorkspace(repositoryRoot, options = {}) {
  try {
    return await checkWorkspaceInternal(repositoryRoot, options);
  } catch (error) {
    return { failures: [`ICM workspace check could not read its configured surface: ${error.message}`] };
  }
}

function commandOptions(args) {
  const result = {};
  const keys = { '--project': 'projectSlug', '--reviewed-commit': 'reviewedCommit' };
  for (let i = 0; i < args.length; i += 2) {
    const key = keys[args[i]];
    if (!key || result[key] || !args[i + 1] || args[i + 1].startsWith('--')) {
      throw new Error('Usage: workspace-check.mjs [--project <slug> [--reviewed-commit <full-sha>]]');
    }
    result[key] = args[i + 1];
  }
  return result;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
    const result = await checkWorkspace(repositoryRoot, commandOptions(process.argv.slice(2)));
    if (result.failures.length) {
      console.error('ICM workspace check failed:');
      for (const failure of result.failures) console.error(`- ${failure}`);
      process.exitCode = 1;
    } else {
      console.log('ICM workspace check passed (structure and requested revision comparison only; not approval).');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

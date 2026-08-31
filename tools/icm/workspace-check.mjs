import { spawn } from 'node:child_process';
import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { candidateGateConfigurationErrors } from './config.mjs';

const APPROVAL_ARTIFACTS = [
  {
    role: 'product specification',
    type: 'product-specification',
    relativePath: 'specs/product-spec.md',
    receiptPath: 'approvals/product-specification.md',
    statuses: ['draft', 'feasibility-requested', 'rejected', 'approved'],
  },
  {
    role: 'technical specification',
    type: 'technical-specification',
    relativePath: 'specs/technical-spec.md',
    receiptPath: 'approvals/technical-specification.md',
    statuses: ['draft', 'product-feedback', 'rejected', 'approved'],
  },
  {
    role: 'delivery assessment',
    type: 'delivery-assessment',
    relativePath: 'delivery-assessment.md',
    receiptPath: 'approvals/delivery-assessment.md',
    statuses: ['proposed', 'rejected', 'approved'],
  },
];

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null' || trimmed === '~') return null;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inside = trimmed.slice(1, -1).trim();
    if (!inside) return [];
    return inside.split(',').map((entry) => parseScalar(entry));
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) return trimmed.slice(1, -1);
  return trimmed;
}

function parseYamlSubset(source) {
  const lines = source.split(/\r?\n/).flatMap((line) => {
    if (!line.trim() || /^\s*#/.test(line)) return [];
    const indent = line.match(/^ */)[0].length;
    if (indent % 2 !== 0) throw new Error('frontmatter indentation must use two-space levels');
    return [{ indent, content: line.trim() }];
  });

  const parseNode = (start, indent) => {
    if (lines[start]?.content.startsWith('- ')) return parseArray(start, indent);
    return parseObject(start, indent);
  };
  const parseObject = (start, indent) => {
    const value = {};
    let index = start;
    while (index < lines.length && lines[index].indent === indent && !lines[index].content.startsWith('- ')) {
      const match = lines[index].content.match(/^([^:]+):(.*)$/);
      if (!match) throw new Error(`invalid frontmatter entry: ${lines[index].content}`);
      const key = match[1].trim();
      const rest = match[2].trim();
      if (rest) {
        value[key] = parseScalar(rest);
        index += 1;
      } else if (lines[index + 1] && lines[index + 1].indent > indent) {
        const nested = parseNode(index + 1, lines[index + 1].indent);
        value[key] = nested.value;
        index = nested.index;
      } else {
        value[key] = '';
        index += 1;
      }
    }
    return { value, index };
  };
  const parseArray = (start, indent) => {
    const value = [];
    let index = start;
    while (index < lines.length && lines[index].indent === indent && lines[index].content.startsWith('- ')) {
      const rest = lines[index].content.slice(2).trim();
      const mapping = rest.match(/^([^:]+):(.*)$/);
      if (!mapping) {
        value.push(parseScalar(rest));
        index += 1;
        continue;
      }
      const item = { [mapping[1].trim()]: parseScalar(mapping[2].trim()) };
      index += 1;
      if (index < lines.length && lines[index].indent > indent) {
        const nested = parseObject(index, lines[index].indent);
        Object.assign(item, nested.value);
        index = nested.index;
      }
      value.push(item);
    }
    return { value, index };
  };

  return lines.length === 0 ? {} : parseNode(0, lines[0].indent).value;
}

export function parseFrontmatter(path, body) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path} is missing YAML frontmatter`);
  try {
    return parseYamlSubset(match[1]);
  } catch (error) {
    throw new Error(`${path} has invalid YAML frontmatter: ${error.message}`);
  }
}

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

async function gitObjectId(repositoryRoot, body) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('git', ['hash-object', '--stdin'], {
      cwd: repositoryRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', rejectPromise);
    child.once('exit', (code) => {
      if (code === 0) resolvePromise(stdout.trim());
      else rejectPromise(new Error(`git hash-object failed: ${stderr.trim()}`));
    });
    child.stdin.end(body);
  });
}

function headingSection(body, wanted) {
  const headings = [...body.matchAll(/^(#{1,6}) (.+)$/gm)];
  const index = headings.findIndex((heading) => (
    heading[2] === wanted || heading[2].startsWith(`${wanted} —`)
  ));
  if (index < 0) return null;
  const current = headings[index];
  const next = headings.slice(index + 1).find(
    (heading) => heading[1].length <= current[1].length,
  );
  return body.slice(current.index, next?.index);
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

function markdownTableRows(body, heading) {
  const section = headingSection(body, heading);
  if (!section) return [];
  const lines = section.split(/\r?\n/).filter((line) => line.trim().startsWith('|'));
  if (lines.length < 3) return [];
  const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
  const columns = cells(lines[0]);
  return lines.slice(2).map((line) => Object.fromEntries(
    columns.map((column, index) => [column, cells(line)[index] ?? '']),
  ));
}

function markdownTableColumns(body, heading) {
  const section = headingSection(body, heading);
  if (!section) return null;
  const line = section.split(/\r?\n/).find((candidate) => candidate.trim().startsWith('|'));
  if (!line) return null;
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

function productOptionFailures(product, technical) {
  const failures = [];
  const rows = markdownTableRows(product.body, 'Product behavior options')
    .filter((row) => Object.values(row).some((value) => value !== ''));
  const mode = product.metadata.decision_mode;
  if (!['single-track', 'options'].includes(mode)) {
    return [`${product.path} decision_mode must be single-track or options`];
  }
  if (mode === 'single-track') {
    if (rows.length > 0) {
      failures.push(`${product.path} has decision_mode: single-track but defines Product option rows`);
    }
    if (product.metadata.selected_product_option) {
      failures.push(`${product.path} is single-track but selects ${product.metadata.selected_product_option}`);
    }
    return failures;
  }

  const ids = rows.map((row) => row.ID);
  const uniqueIds = new Set(ids);
  if (rows.length < 2 || rows.length > 3) {
    failures.push(`${product.path} must define two or three Product option rows`);
  }
  if (ids.some((id) => !/^P[1-9]\d*$/.test(id ?? ''))) {
    failures.push(`${product.path} has an invalid Product option ID`);
  }
  if (uniqueIds.size !== ids.length) failures.push(`${product.path} has duplicate Product option IDs`);
  const selected = product.metadata.selected_product_option;
  const selectionRequired = product.metadata.status === 'approved';
  if ((selectionRequired || selected) && !uniqueIds.has(selected)) {
    failures.push(`${product.path} selected_product_option ${selected || 'missing'} is not an option row`);
  }
  const selectedRows = rows.filter((row) => row.Status === 'Selected');
  if (
    (selectionRequired || selected)
    && (selectedRows.length !== 1 || selectedRows[0]?.ID !== selected)
  ) failures.push(`${product.path} must mark exactly ${selected || 'the selected option'} as Selected`);
  if (!selectionRequired && !selected && selectedRows.length > 0) {
    failures.push(`${product.path} marks an option Selected without selected_product_option`);
  }

  if (technical) {
    const assessedIds = markdownTableRows(technical.body, 'Product behavior feasibility')
      .filter((row) => Object.values(row).some((value) => value !== ''))
      .map((row) => row['Product option']);
    if (
      assessedIds.length !== ids.length
      || new Set(assessedIds).size !== assessedIds.length
      || ids.some((id) => !assessedIds.includes(id))
    ) failures.push(`${technical.path} must assess the exact Product option set ${ids.join(', ')}`);
  }
  return failures;
}

function technicalDesignSelectionFailures(technical) {
  const rows = markdownTableRows(technical.body, 'Design options and decision')
    .filter((row) => Object.values(row).some((value) => value !== ''));
  const selected = rows.filter((row) => row.Decision === 'Selected');
  return selected.length === 1
    ? []
    : [`${technical.path} must mark exactly one Design options and decision row Selected`];
}

async function approvalFailures(repositoryRoot) {
  const failures = [];
  let entries = [];
  try {
    entries = await readdir(join(repositoryRoot, 'projects'), { withFileTypes: true });
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  for (const entry of entries) {
    const slug = entry.name;
    if (entry.isSymbolicLink()) {
      failures.push(`projects/${slug} must be a real directory; Project symlinks are not allowed`);
      continue;
    }
    if (!entry.isDirectory()) continue;
    const projectPath = `projects/${slug}/PROJECT.md`;
    const projectBody = await optionalRead(repositoryRoot, projectPath);
    if (!projectBody) {
      failures.push(`${projectPath} is required for Project directory ${slug}`);
      continue;
    }
    let project;
    try {
      project = parseFrontmatter(projectPath, projectBody);
    } catch (error) {
      failures.push(error.message);
      continue;
    }
    if (project.type !== 'project') {
      failures.push(`${projectPath} must declare type: project`);
    }
    if (project.id !== slug) {
      failures.push(`${projectPath} id ${project.id || 'missing'} must match directory ${slug}`);
    }
    if (project.approval_contract !== 'artifact-receipts') {
      continue;
    }

    const artifacts = new Map();
    for (const definition of APPROVAL_ARTIFACTS) {
      const artifactPath = `projects/${slug}/${definition.relativePath}`;
      const body = await optionalRead(repositoryRoot, artifactPath);
      if (!body) continue;
      let metadata;
      try {
        metadata = parseFrontmatter(artifactPath, body);
      } catch (error) {
        failures.push(error.message);
        continue;
      }
      if (!definition.statuses.includes(metadata.status)) {
        failures.push(`${artifactPath} has invalid status ${metadata.status || 'missing'}`);
        continue;
      }
      if (metadata.type !== definition.type) {
        failures.push(`${artifactPath} must declare type: ${definition.type}`);
      }
      if (metadata.project !== slug) {
        failures.push(`${artifactPath} names Project ${metadata.project || 'missing'}, expected ${slug}`);
      }
      const artifact = {
        ...definition,
        path: artifactPath,
        body,
        metadata,
        blob: await gitObjectId(repositoryRoot, body),
      };
      artifacts.set(definition.role, artifact);
      if (metadata.status !== 'approved') continue;

      const receiptPath = `projects/${slug}/${definition.receiptPath}`;
      const receiptBody = await optionalRead(repositoryRoot, receiptPath);
      if (!receiptBody) {
        failures.push(`${artifactPath} is approved without ${receiptPath}`);
        continue;
      }
      let receipt;
      try {
        receipt = parseFrontmatter(receiptPath, receiptBody);
      } catch (error) {
        failures.push(error.message);
        continue;
      }
      const actualBlob = artifact.blob;
      if (receipt.type !== 'approval-receipt') failures.push(`${receiptPath} must be an approval receipt`);
      if (receipt.project !== slug) failures.push(`${receiptPath} names the wrong Project`);
      if (receipt.artifact !== artifactPath) failures.push(`${receiptPath} names the wrong artifact`);
      if (receipt.artifact_blob !== actualBlob) failures.push(`${artifactPath} does not match approved blob ${receipt.artifact_blob || 'missing'}`);
      if (receipt.decision !== 'approved') failures.push(`${receiptPath} decision must be approved`);
      if (typeof receipt.source !== 'string' || receipt.source.trim() === '') {
        failures.push(`${receiptPath} must name the human approval source`);
      }
    }

    const product = artifacts.get('product specification');
    const technical = artifacts.get('technical specification');
    const delivery = artifacts.get('delivery assessment');
    const activeTechnicalAssessment = ['product-feedback', 'approved'].includes(technical?.metadata.status)
      ? technical
      : undefined;
    if (product) {
      failures.push(...productOptionFailures(product, activeTechnicalAssessment));
    }
    if (product?.metadata.status === 'feasibility-requested' && product.metadata.decision_mode !== 'options') {
      failures.push(`${product.path} feasibility-requested requires decision_mode: options`);
    }
    if (technical?.metadata.status === 'product-feedback') {
      if (product?.metadata.status !== 'feasibility-requested') {
        failures.push(`${technical.path} product-feedback requires a feasibility-requested product specification`);
      } else {
        const expected = `${product.path}@${product.blob}`;
        if (technical.metadata.product_specification !== expected) {
          failures.push(`${technical.path} must reference ${expected}`);
        }
      }
    }
    if (technical?.metadata.status === 'approved' && product?.metadata.status !== 'approved') {
      failures.push(`${technical.path} technical specification is approved without an approved product specification`);
    } else if (technical?.metadata.status === 'approved') {
      failures.push(...technicalDesignSelectionFailures(technical));
      const expected = `${product.path}@${product.blob}`;
      if (technical.metadata.product_specification !== expected) {
        failures.push(`${technical.path} must reference ${expected}`);
      }
    }
    if (delivery?.metadata.status === 'approved' && product?.metadata.status !== 'approved') {
      failures.push(`${delivery.path} delivery assessment is approved without an approved product specification`);
    }
    if (delivery?.metadata.status === 'approved' && technical?.metadata.status !== 'approved') {
      failures.push(`${delivery.path} delivery assessment is approved without an approved technical specification`);
    }
    if (delivery?.metadata.status === 'approved' && product?.metadata.status === 'approved') {
      const expected = `${product.path}@${product.blob}`;
      if (delivery.metadata.product_specification !== expected) {
        failures.push(`${delivery.path} must reference ${expected}`);
      }
    }
    if (delivery?.metadata.status === 'approved' && technical?.metadata.status === 'approved') {
      const expected = `${technical.path}@${technical.blob}`;
      if (delivery.metadata.technical_specification !== expected) {
        failures.push(`${delivery.path} must reference ${expected}`);
      }
    }
  }
  return failures;
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

async function markdownLinkFailures(repositoryRoot) {
  const failures = [];
  const files = await repositoryFiles(repositoryRoot, (name) => name.endsWith('.md'));
  for (const path of files) {
    const body = await readFile(path, 'utf8');
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
  ['projects/<project-slug>/specs/product-spec.md', '_templates/specification/product-spec.md'],
  ['projects/<project-slug>/specs/technical-spec.md', '_templates/specification/technical-spec.md'],
  ['projects/<project-slug>/delivery-assessment.md', '_templates/delivery-assessment.md'],
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
    'workflow-hub': ['One job:', '## Project path binding', '## Stages', 'Do not infer approval', '## Capability routing', '## Human check'],
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

async function checkWorkspaceInternal(
  repositoryRoot,
  { checkWorkflowContracts = true } = {},
) {
  const configBody = await optionalRead(repositoryRoot, 'icm.config.json');
  let config = {};
  if (configBody) {
    try {
      config = JSON.parse(configBody);
    } catch (error) {
      return { failures: [`icm.config.json is invalid JSON: ${error.message}`] };
    }
  }
  const failures = await configurationFailures(repositoryRoot, config, Boolean(configBody));
  failures.push(...await approvalFailures(repositoryRoot));
  failures.push(...await markdownLinkFailures(repositoryRoot));
  if (checkWorkflowContracts) {
    failures.push(...await rootRouteFailures(repositoryRoot));
    failures.push(...await workflowFailures(repositoryRoot));
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

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const result = await checkWorkspace(repositoryRoot);
  if (result.failures.length > 0) {
    console.error('ICM workspace check failed:');
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('ICM workspace check passed.');
  }
}

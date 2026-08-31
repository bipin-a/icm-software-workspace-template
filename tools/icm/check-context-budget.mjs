import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_TEMPLATES = new Map([
  ['projects/<project-slug>/PROJECT.md', '_templates/project/PROJECT.md'],
  ['projects/<project-slug>/specs/product-spec.md', '_templates/specification/product-spec.md'],
  ['projects/<project-slug>/specs/technical-spec.md', '_templates/specification/technical-spec.md'],
  ['projects/<project-slug>/delivery-assessment.md', '_templates/delivery-assessment.md'],
]);

function parseScalar(value) {
  const text = value.trim();
  if (text === '') return '';
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (text === 'null' || text === '~') return null;
  if (/^-?\d+$/.test(text)) return Number(text);
  if (text.startsWith('[') && text.endsWith(']')) {
    const inner = text.slice(1, -1).trim();
    return inner ? inner.split(',').map(parseScalar) : [];
  }
  if (
    (text.startsWith('"') && text.endsWith('"'))
    || (text.startsWith("'") && text.endsWith("'"))
  ) return text.slice(1, -1);
  return text;
}

function parseYaml(source) {
  const lines = source.split(/\r?\n/).flatMap((line) => {
    if (!line.trim() || /^\s*#/.test(line)) return [];
    const indent = line.match(/^ */)[0].length;
    if (indent % 2) throw new Error('indentation must use two-space levels');
    return [{ indent, text: line.trim() }];
  });

  const parseNode = (start, indent) => (
    lines[start]?.text.startsWith('- ')
      ? parseArray(start, indent)
      : parseObject(start, indent)
  );
  const parseObject = (start, indent) => {
    const value = {};
    let index = start;
    while (index < lines.length && lines[index].indent === indent && !lines[index].text.startsWith('- ')) {
      const match = lines[index].text.match(/^([^:]+):(.*)$/);
      if (!match) throw new Error(`invalid entry: ${lines[index].text}`);
      const key = match[1].trim();
      const rest = match[2].trim();
      if (rest) {
        value[key] = parseScalar(rest);
        index += 1;
      } else if (lines[index + 1]?.indent > indent) {
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
    while (index < lines.length && lines[index].indent === indent && lines[index].text.startsWith('- ')) {
      const rest = lines[index].text.slice(2).trim();
      const mapping = rest.match(/^([^:]+):(.*)$/);
      if (!mapping) {
        value.push(parseScalar(rest));
        index += 1;
        continue;
      }
      const item = { [mapping[1].trim()]: parseScalar(mapping[2].trim()) };
      index += 1;
      if (lines[index]?.indent > indent) {
        const nested = parseObject(index, lines[index].indent);
        Object.assign(item, nested.value);
        index = nested.index;
      }
      value.push(item);
    }
    return { value, index };
  };

  return lines.length ? parseNode(0, lines[0].indent).value : {};
}

function parseFrontmatter(path, body) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path} is missing YAML frontmatter`);
  try {
    return parseYaml(match[1]);
  } catch (error) {
    throw new Error(`${path} has invalid YAML frontmatter: ${error.message}`);
  }
}

export function estimateTokens(body) {
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return Math.ceil(Math.max(words * 1.5, body.length / 4));
}

function safePath(path) {
  return typeof path === 'string'
    && path.length > 0
    && !path.startsWith('/')
    && !path.includes('\\')
    && !path.split('/').some((part) => part === '.' || part === '..');
}

async function optionalRead(root, path) {
  if (!safePath(path)) return null;
  try {
    return await readFile(resolve(root, path), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function findContexts(directory) {
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
    if (entry.isDirectory()) paths.push(...await findContexts(path));
    else if (entry.isFile() && entry.name === 'CONTEXT.md') paths.push(path);
  }
  return paths;
}

const repositoryPath = (root, path) => relative(root, path).split(sep).join('/');

function headingSection(body, wanted) {
  const headings = [...body.matchAll(/^(#{1,6}) (.+)$/gm)];
  const index = headings.findIndex((heading) => (
    heading[2] === wanted || heading[2].startsWith(`${wanted} —`)
  ));
  if (index < 0) return '';
  const current = headings[index];
  const next = headings.slice(index + 1).find(
    (heading) => heading[1].length <= current[1].length,
  );
  return body.slice(current.index, next?.index);
}

function selectedSections(body, entry) {
  const headings = [
    ...(Array.isArray(entry.headings) ? entry.headings : []),
    ...(Array.isArray(entry.tables) ? entry.tables.map((table) => table.heading) : []),
  ];
  return headings.length
    ? [...new Set(headings)].map((heading) => headingSection(body, heading)).join('\n')
    : body;
}

function profileSelections(root, profilePath, section) {
  return section.split(/\r?\n/).flatMap((line) => {
    if (!line.trim().startsWith('|')) return [];
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
    const target = cells[0]?.match(/\]\(([^)]+)\)/)?.[1];
    let selection = cells[1] ?? '';
    if (/^Conditional\b/.test(selection)) selection = selection.slice(selection.indexOf(':') + 1);
    const headings = [...selection.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    if (!target || !headings.length) return [];
    return [{
      path: repositoryPath(root, resolve(dirname(resolve(root, profilePath)), target)),
      headings,
    }];
  });
}

function sourcePath(path, projectSlug) {
  if (projectSlug) return path.replace('<project-slug>', projectSlug);
  if (PROJECT_TEMPLATES.has(path)) return PROJECT_TEMPLATES.get(path);
  return path.includes('<') || path.includes('{') ? null : path;
}

async function projectSlugs(root) {
  try {
    return (await readdir(resolve(root, 'projects'), { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

async function packetParts(root, contractBody, context, commonPaths, projectSlug) {
  const parts = [contractBody];
  for (const path of commonPaths) {
    const body = await optionalRead(root, path);
    if (body) parts.push(body);
  }

  const profile = context.profile;
  const profileBody = profile?.path ? await optionalRead(root, profile.path) : null;
  if (profileBody) {
    const section = headingSection(profileBody, profile.heading);
    parts.push(section);
    for (const selection of profileSelections(root, profile.path, section)) {
      const body = await optionalRead(root, selection.path);
      if (body) {
        parts.push(...selection.headings.map((heading) => headingSection(body, heading)));
      }
    }
  }

  for (const entry of [
    ...(context.inputs ?? []),
    ...(context.references ?? []),
    ...(context.output_templates ?? []),
  ]) {
    const path = sourcePath(entry.path ?? '', projectSlug);
    if (!path) continue;
    const body = await optionalRead(root, path);
    if (body) parts.push(selectedSections(body, entry));
  }
  return parts.filter(Boolean);
}

function configurationFailures(config) {
  const failures = [];
  if (config?.schemaVersion !== 1) failures.push('icm.config.json must declare schemaVersion 1');
  const context = config?.context;
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return [...failures, 'icm.config.json context must be an object'];
  }
  if (!Array.isArray(context.commonPaths)) {
    failures.push('icm.config.json context.commonPaths must be a list');
  }
  const names = ['hubTokens', 'routerTokens', 'stepTokens', 'packetTokens', 'reserveTokens'];
  for (const name of names) {
    if (!Number.isFinite(context.limits?.[name]) || context.limits[name] < 0) {
      failures.push(`icm.config.json context limit ${name} must be a non-negative number`);
    }
  }
  if (!Array.isArray(context.budgetScenarios)) {
    failures.push('icm.config.json context.budgetScenarios must be a list');
  }
  for (const scenario of context.budgetScenarios ?? []) {
    if (
      typeof scenario?.name !== 'string'
      || !safePath(scenario.contract)
      || !Array.isArray(scenario.selectors)
      || scenario.selectors.some((path) => !safePath(path))
    ) failures.push('each budget scenario requires a name, contract, and selector list');
  }
  return failures;
}

export async function checkContextBudgets(root, options = {}) {
  const failures = [];
  let config = options.config;
  if (!config) {
    try {
      config = JSON.parse(await readFile(resolve(root, 'icm.config.json'), 'utf8'));
    } catch (error) {
      return { failures: [`icm.config.json could not be read: ${error.message}`] };
    }
  }
  failures.push(...configurationFailures(config));
  if (failures.length) return { failures };

  const { commonPaths, limits, budgetScenarios } = config.context;
  for (const path of commonPaths) {
    if (!await optionalRead(root, path)) failures.push(`context common path ${path} does not exist`);
  }

  const scenariosByContract = new Map();
  for (const scenario of budgetScenarios) {
    const scenarios = scenariosByContract.get(scenario.contract) ?? [];
    scenarios.push(scenario);
    scenariosByContract.set(scenario.contract, scenarios);
  }
  const contexts = await findContexts(resolve(root, 'workflows'));
  for (const path of contexts) {
    const scope = repositoryPath(root, path);
    const body = await readFile(path, 'utf8');
    let metadata;
    try {
      metadata = parseFrontmatter(scope, body);
    } catch (error) {
      failures.push(error.message);
      continue;
    }
    const limit = metadata.type === 'workflow-hub'
      ? limits.hubTokens
      : metadata.type === 'workflow-router'
        ? limits.routerTokens
        : limits.stepTokens;
    const contractTokens = estimateTokens(body);
    if (contractTokens > limit) {
      failures.push(`${scope} exceeds its ${limit}-token contract budget (${contractTokens})`);
    }
    if (metadata.type !== 'workflow-step' || !metadata.context) continue;

    const profile = metadata.context.profile;
    if (profile?.path) {
      const profileBody = await optionalRead(root, profile.path);
      if (!profileBody) {
        failures.push(`${scope} profile ${profile.path} does not exist`);
      } else if (!headingSection(profileBody, profile.heading)) {
        failures.push(`${scope} profile ${profile.path} does not define heading ${profile.heading}`);
      }
    }

    const declaredSelectors = new Set(
      (metadata.context.selectors ?? []).map((entry) => entry.path),
    );
    const scenarios = scenariosByContract.get(scope) ?? [];
    const coveredSelectors = new Set(scenarios.flatMap((scenario) => scenario.selectors));
    for (const selector of declaredSelectors) {
      if (!coveredSelectors.has(selector)) {
        failures.push(`${scope} selector ${selector} has no budget scenario`);
      }
    }

    const variants = [null, ...await projectSlugs(root)];
    for (const projectSlug of variants) {
      const label = projectSlug ? ` for Project ${projectSlug}` : '';
      const base = await packetParts(root, body, metadata.context, commonPaths, projectSlug);
      const baseTokens = estimateTokens(base.join('\n'));
      if (baseTokens + limits.reserveTokens > limits.packetTokens) {
        failures.push(
          `${scope}${label} packet exceeds ${limits.packetTokens} tokens `
          + `(${baseTokens} + ${limits.reserveTokens} reserve)`,
        );
      }
      for (const scenario of scenarios) {
        const selectorBodies = [];
        for (const selector of scenario.selectors) {
          if (!declaredSelectors.has(selector)) {
            failures.push(`${scope} budget scenario ${scenario.name} uses undeclared selector ${selector}`);
            continue;
          }
          const selectorBody = await optionalRead(root, selector);
          if (!selectorBody) failures.push(`${scope} budget selector ${selector} does not exist`);
          else selectorBodies.push(selectorBody);
        }
        const tokens = estimateTokens([...base, ...selectorBodies].join('\n'));
        if (tokens + limits.reserveTokens > limits.packetTokens) {
          failures.push(
            `${scope} budget scenario ${scenario.name}${label} exceeds `
            + `${limits.packetTokens} tokens (${tokens} + ${limits.reserveTokens} reserve)`,
          );
        }
      }
    }
  }
  return { failures: [...new Set(failures)] };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const result = await checkContextBudgets(root);
  if (result.failures.length) {
    console.error('Context budget check failed:');
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('Context budget check passed.');
  }
}

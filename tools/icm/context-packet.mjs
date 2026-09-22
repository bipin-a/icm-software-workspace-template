import { readFile, realpath } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, headingSection } from './markdown.mjs';
import { estimateTokens } from './estimate-context.mjs';
import { featureProjectChecks } from './feature-review.mjs';

async function readWithin(root, path) {
  if (typeof path !== 'string' || !path || path.startsWith('/') || /[\\:{}]/.test(path)
    || path.split('/').some(part => !part || part === '..' || part === '.')) throw new Error(`Invalid context path: ${path}`);
  const target = await realpath(resolve(root, path));
  if (relative(await realpath(root), target).startsWith('..')) throw new Error(`Context path escapes repository: ${path}`);
  return readFile(target, 'utf8');
}

function section(body, heading, path) {
  const matches = [...body.matchAll(/^(#{1,6}) (.+)$/gm)].filter(match => match[2] === heading || match[2].startsWith(`${heading} —`));
  if (matches.length !== 1) throw new Error(`${path} needs exactly one heading ${heading}`);
  return headingSection(body, heading);
}

export function selectContextNodes(manifest, { criterion, environment, workItem } = {}) {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.nodes)
    || Object.keys(manifest).some(key => !['schemaVersion', 'nodes'].includes(key))) throw new Error('Context manifest requires schemaVersion 1 and nodes');
  const nodes = new Map();
  for (const node of manifest.nodes) {
    if (!node || Object.keys(node).some(key => !['id', 'criteria', 'environments', 'dependencies', 'inputs'].includes(key))
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(node.id ?? '') || nodes.has(node.id)) throw new Error('Invalid or duplicate context node');
    for (const field of ['criteria', 'environments', 'dependencies']) {
      if (!Array.isArray(node[field]) || node[field].some(value => typeof value !== 'string' || !value.trim())
        || new Set(node[field]).size !== node[field].length || (field !== 'dependencies' && !node[field].length)) throw new Error(`${node.id}: invalid ${field}`);
    }
    if (!Array.isArray(node.inputs) || !node.inputs.length) throw new Error(`${node.id}: inputs are required`);
    nodes.set(node.id, node);
  }
  const visited = new Set(), visiting = new Set();
  const visit = id => {
    if (!nodes.has(id)) throw new Error(`Missing context dependency: ${id}`);
    if (visiting.has(id)) throw new Error(`Context dependency cycle: ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    nodes.get(id).dependencies.forEach(visit);
    visiting.delete(id); visited.add(id);
  };
  for (const id of nodes.keys()) visit(id);
  for (const [field, value] of [['criteria', criterion], ['environments', environment]]) {
    if (value && ![...nodes.values()].some(node => node[field].includes(value))) throw new Error(`Unknown ${field} selector: ${value}`);
  }
  if (workItem && !nodes.has(workItem)) throw new Error(`Unknown work item: ${workItem}`);
  const matches = node => (!criterion || node.criteria.includes('All') || node.criteria.includes(criterion))
    && (!environment || node.environments.includes('All') || node.environments.includes(environment));
  if (workItem && !matches(nodes.get(workItem))) throw new Error('Work item contradicts criterion/environment selectors');
  const selected = new Set();
  const include = id => {
    if (selected.has(id)) return;
    nodes.get(id).dependencies.forEach(include);
    selected.add(id);
  };
  if (workItem) include(workItem);
  else for (const node of nodes.values()) if (matches(node)) include(node.id);
  if (!selected.size) throw new Error('Context selectors matched no nodes');
  return [...selected].map(id => nodes.get(id));
}

export async function loadContextManifest(root, project, brief) {
  if (!brief.context_packets) return null;
  if (typeof brief.context_packets !== 'string') throw new Error('context_packets must name a Project-relative JSON file');
  const manifest = JSON.parse(await readWithin(root, `projects/${project}/${brief.context_packets}`));
  selectContextNodes(manifest);
  for (const node of manifest.nodes) for (const input of node.inputs) {
    if (!input || Object.keys(input).some(key => !['path', 'headings'].includes(key))) throw new Error(`${node.id}: unknown input field`);
    if (input.path?.startsWith('projects/') && !input.path.startsWith(`projects/${project}/`)) throw new Error('Context input selects another Project');
    const body = await readWithin(root, input.path);
    if (!Array.isArray(input.headings) || !input.headings.length || input.headings.some(h => typeof h !== 'string' || !h)) throw new Error(`${node.id}: explicit input headings are required`);
    for (const heading of input.headings) section(body, heading, input.path);
  }
  return manifest;
}

export async function assembleContext(root, { project, stage, criterion, environment, workItem, rules = [] } = {}) {
  const checked = await featureProjectChecks(root, project);
  if (checked.failures.length) throw new Error(checked.failures.join('; '));
  if (typeof stage !== 'string' || !/^workflows\/.+\/CONTEXT\.md$/.test(stage)) throw new Error('Select an exact workflow step path');
  const briefPath = `projects/${project}/PROJECT.md`;
  const brief = parseFrontmatter(briefPath, await readWithin(root, briefPath));
  const stageBody = await readWithin(root, stage);
  const contract = parseFrontmatter(stage, stageBody);
  if (contract.type !== 'workflow-step') throw new Error('Context assembly requires a workflow-step, not a router');
  const files = new Map();
  const add = async input => {
    if (!input || Object.keys(input).some(key => !['path', 'headings'].includes(key))) throw new Error('Context inputs accept only path and headings');
    const path = input.path?.replaceAll('<project-slug>', project);
    const body = await readWithin(root, path);
    if (input.headings !== undefined && (!Array.isArray(input.headings) || !input.headings.length || input.headings.some(h => typeof h !== 'string' || !h))) throw new Error(`${path}: headings must be a nonempty list`);
    const current = files.get(path) ?? { path, full: false, sections: new Map() };
    if (!input.headings) { current.full = true; current.body = body; }
    else for (const heading of input.headings) current.sections.set(heading, section(body, heading, path));
    files.set(path, current);
  };
  for (const path of ['AGENTS.md', 'CONTEXT.md', '_shared/voice.md', '_shared/engineering/decision-work.md', '_shared/principles/engineering-principles.md', stage]) await add({ path });
  await add({ path: briefPath, headings: ['Intent', 'Open questions'] });
  const profile = contract.context?.profile;
  if (!profile?.path || !profile.heading) throw new Error('Workflow step needs an exact profile');
  await add({ path: profile.path, headings: [profile.heading] });
  const profileBody = section(await readWithin(root, profile.path), profile.heading, profile.path);
  const selectedRules = new Set();
  for (const line of profileBody.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map(cell => cell.trim());
    const target = cells[1]?.match(/\]\(([^)]+)\)/)?.[1];
    if (!target) continue;
    const headings = [...(cells[2] ?? '').matchAll(/`([^`]+)`/g)].map(match => match[1]);
    const chosen = /^Conditional\b/.test(cells[2]) ? headings.filter(heading => rules.includes(heading)) : headings;
    for (const heading of chosen) selectedRules.add(heading);
    if (chosen.length) await add({ path: relative(root, resolve(root, dirname(profile.path), target)), headings: chosen });
  }
  for (const rule of rules) if (!selectedRules.has(rule)) throw new Error(`Unknown profile rule: ${rule}`);
  for (const input of [...(contract.context.inputs ?? []), ...(contract.context.references ?? [])]) await add(input);
  let nodes = [];
  if (brief.context_packets) {
    const manifest = await loadContextManifest(root, project, brief);
    nodes = selectContextNodes(manifest, { criterion, environment, workItem });
    for (const node of nodes) for (const input of node.inputs) await add(input);
  } else if (criterion || environment || workItem) throw new Error('Scoped selectors require context_packets in the Project brief');
  const entries = [...files.values()].map(file => {
    const body = file.full ? file.body : [...file.sections.values()].join('\n');
    return { path: file.path, headings: file.full ? null : [...file.sections.keys()], body, tokens: estimateTokens(body) };
  });
  const config = JSON.parse(await readWithin(root, 'icm.config.json'));
  const { packetTokens, reserveTokens } = config.context ?? {};
  if (![packetTokens, reserveTokens].every(value => Number.isFinite(value) && value >= 0)) throw new Error('Invalid context token budget');
  const expectedTokens = entries.reduce((sum, entry) => sum + entry.tokens, 0) + reserveTokens;
  return { project, stage, nodes: nodes.map(node => node.id), entries, summary: { expectedTokens, packetTokens, reserveTokens, oversized: expectedTokens > packetTokens } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = { rules: [] }, args = process.argv.slice(2);
    const keys = { '--project': 'project', '--stage': 'stage', '--criterion': 'criterion', '--environment': 'environment', '--work-item': 'workItem' };
    for (let i = 0; i < args.length; i += 2) {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Each context option requires a value');
      if (args[i] === '--rule') options.rules.push(args[i + 1]);
      else if (!keys[args[i]] || options[keys[args[i]]]) throw new Error(`Unknown or repeated option: ${args[i]}`);
      else options[keys[args[i]]] = args[i + 1];
    }
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
    console.log(JSON.stringify(await assembleContext(root, options), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parseFrontmatter } from '../markdown.mjs';
import { assembleContext, selectContextNodes } from '../context-packet.mjs';
const template = fileURLToPath(new URL('../../..', import.meta.url));
const node = (id, dependencies = [], criteria = ['All']) => ({ id, dependencies, criteria, environments: ['All'], inputs: [{ path: 'projects/example/decisions.md', headings: [id] }] });

test('context selectors include transitive prerequisites and reject ambiguous graphs', () => {
  const manifest = { schemaVersion: 1, nodes: [node('base'), node('feature', ['base'], ['search']), node('other', [], ['export'])] };
  assert.deepEqual(selectContextNodes(manifest, { criterion: 'search' }).map(n => n.id), ['base', 'feature']);
  assert.deepEqual(selectContextNodes(manifest, { workItem: 'feature' }).map(n => n.id), ['base', 'feature']);
  assert.throws(() => selectContextNodes(manifest, { criterion: 'missing' }), /Unknown/);
  assert.throws(() => selectContextNodes(manifest, { workItem: 'other', criterion: 'search' }), /contradicts/);
  assert.throws(() => selectContextNodes({ ...manifest, nodes: [node('x', ['missing'])] }), /Missing/);
  assert.throws(() => selectContextNodes({ ...manifest, nodes: [node('x', ['y']), node('y', ['x'])] }), /cycle/);
  assert.throws(() => selectContextNodes({ ...manifest, nodes: [node('x'), node('x')] }), /duplicate/);
});

test('packet assembly selects real sections, retains oversized evidence, and rejects escapes', async t => {
  const root = await mkdtemp(join(tmpdir(), 'icm-context-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(template, root, { recursive: true, filter: p => !['.git', 'node_modules'].includes(p.split('/').at(-1)) });
  await mkdir(join(root, 'projects/example'), { recursive: true });
  const brief = '---\ntype: project\nid: example\ntitle: Example\nworkflow: feature-work\ncontext_packets: context.json\ndecision_documents: [decisions.md]\n---\n'
    + ['Intent', 'Product behavior', 'Technical choices', 'Acceptance and proof', 'Open questions', 'Links'].map(h => `## ${h}\n\nAccepted evidence for ${h}.\n`).join('\n');
  await writeFile(join(root, 'projects/example/PROJECT.md'), brief);
  await writeFile(join(root, 'projects/example/decisions.md'), '## base\nRequired owner.\n## feature\nSelected behavior.\n## other\nUnrelated behavior.\n');
  const manifest = { schemaVersion: 1, nodes: [node('base'), node('feature', ['base'], ['search']), node('other', [], ['export'])] };
  await writeFile(join(root, 'projects/example/context.json'), JSON.stringify(manifest));
  const config = JSON.parse(await readFile(join(root, 'icm.config.json'), 'utf8'));
  config.context.packetTokens = 1;
  await writeFile(join(root, 'icm.config.json'), JSON.stringify(config));
  const options = { project: 'example', stage: 'workflows/04_validate/02_validate-criterion/CONTEXT.md', criterion: 'search' };
  const result = await assembleContext(root, options);
  assert.equal(result.summary.oversized, true);
  const decision = result.entries.find(e => e.path.endsWith('decisions.md'));
  assert.match(decision.body, /Required owner/);
  assert.match(decision.body, /Selected behavior/);
  assert.doesNotMatch(decision.body, /Unrelated behavior/);
  for (const file of await readdir(join(root, 'workflows'), { recursive: true })) {
    if (!file.endsWith('CONTEXT.md')) continue;
    const path = `workflows/${file}`;
    const contract = parseFrontmatter(path, await readFile(join(root, path), 'utf8'));
    if (contract.type !== 'workflow-step') continue;
    const packet = await assembleContext(root, { project: 'example', stage: path, selectors: (contract.context.selectors ?? []).map(source => source.path) });
    for (const source of contract.context.selectors ?? []) assert.ok(packet.entries.some(entry => entry.path === source.path));
    for (const tool of contract.context.tools ?? []) {
      assert.ok(packet.executeOnly.some(entry => entry.path === tool.path));
      assert.ok(!packet.entries.some(entry => entry.path === tool.path), 'execute-only tool code must not be loaded');
    }
  }
  manifest.nodes[1].inputs[0].headings = ['missing'];
  await writeFile(join(root, 'projects/example/context.json'), JSON.stringify(manifest));
  await assert.rejects(assembleContext(root, options), /exactly one heading/);
  manifest.nodes[1].inputs[0] = { path: '../outside.md', headings: ['feature'] };
  await writeFile(join(root, 'projects/example/context.json'), JSON.stringify(manifest));
  await assert.rejects(assembleContext(root, options), /Invalid context path/);
  manifest.nodes[1].inputs[0] = { path: 'projects/example/outside.md', headings: ['feature'] };
  await symlink(resolve(root, '..'), join(root, 'projects/example/outside.md'));
  await writeFile(join(root, 'projects/example/context.json'), JSON.stringify(manifest));
  await assert.rejects(assembleContext(root, options), /escapes repository/);
});

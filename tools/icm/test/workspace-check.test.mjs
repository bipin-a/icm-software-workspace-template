import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { featureProjectChecks } from '../feature-review.mjs';
import { checkWorkspace } from '../workspace-check.mjs';
import { parseFrontmatter } from '../markdown.mjs';

const exec = promisify(execFile);
const git = (root, ...args) => exec('git', args, { cwd: root, encoding: 'utf8' });
const templateRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

async function createFeatureReviewFixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'icm-feature-review-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'projects/example'), { recursive: true });
  await git(root, 'init');
  await git(root, 'config', 'user.name', 'ICM Review Test');
  await git(root, 'config', 'user.email', 'icm-review@example.invalid');
  const brief = `---
type: project
id: example
title: Task filtering
decision_documents: [technical.md]
---
# Task filtering

## Intent
Help a user find incomplete tasks.

## Product behavior
Show task results with manual Refresh.

## Technical choices
[Technical owner](technical.md).

## Acceptance and proof
The task list agrees with the saved task state.

## Open questions
None.

## Links
Review is supplied by the caller from its actual source.
`;
  await writeFile(join(root, 'projects/example/PROJECT.md'), brief);
  await writeFile(join(root, 'projects/example/technical.md'), 'Reuse the task query.\n');
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'Reviewed feature decisions');
  const reviewedCommit = (await git(root, 'rev-parse', 'HEAD')).stdout.trim();
  return { root, brief, reviewedCommit };
}

test('feature review notices unstaged and staged decision changes without receipt files', async (t) => {
  const { root, brief, reviewedCommit } = await createFeatureReviewFixture(t);
  const unchanged = await featureProjectChecks(root, 'example', { reviewedCommit });
  assert.deepEqual(unchanged.failures, []);
  assert.equal(unchanged.comparison.status, 'matches-reviewed-revision');
  const path = join(root, 'projects/example/PROJECT.md');
  await writeFile(path, brief.replace('manual Refresh', 'automatic polling'));
  assert.equal((await featureProjectChecks(root, 'example', { reviewedCommit })).comparison.status, 'needs-review');
  await git(root, 'add', '.');
  assert.match((await featureProjectChecks(root, 'example', { reviewedCommit })).failures.join('\n'), /PROJECT.md/);
  // A spelling-only edit still requires a disposition; code cannot infer meaning.
  await writeFile(path, brief.replace('operator', 'Operator'));
  assert.equal((await featureProjectChecks(root, 'example', { reviewedCommit })).comparison.status, 'needs-review');
  await writeFile(path, brief);
  assert.equal((await featureProjectChecks(root, 'example', { reviewedCommit })).comparison.status, 'needs-review', 'a restored working file must not hide a material staged edit');
  await git(root, 'add', 'projects/example/PROJECT.md');
  await writeFile(join(root, 'projects/example/technical.md'), 'Add an independent checker.\n');
  assert.deepEqual((await featureProjectChecks(root, 'example', { reviewedCommit })).comparison.changed, ['projects/example/technical.md']);
});

test('feature review includes added and removed document owners and rejects stale booleans', async (t) => {
  const { root, brief, reviewedCommit } = await createFeatureReviewFixture(t);
  const path = join(root, 'projects/example/PROJECT.md');
  await writeFile(path, brief.replace('[technical.md]', '[technical.md, rollout.md]'));
  await writeFile(join(root, 'projects/example/rollout.md'), 'Release after migration.\n');
  assert.ok((await featureProjectChecks(root, 'example', { reviewedCommit })).comparison.changed.includes('projects/example/rollout.md'));
  await writeFile(path, brief.replace('decision_documents: [technical.md]\n', ''));
  await rm(join(root, 'projects/example/technical.md'));
  assert.ok((await featureProjectChecks(root, 'example', { reviewedCommit })).comparison.changed.includes('projects/example/technical.md'));
  await writeFile(path, brief.replace('type: project', 'type: project\nreviewed: true'));
  assert.match((await featureProjectChecks(root, 'example')).failures.join('\n'), /must not store reviewed/);
});

test('feature review rejects missing source revisions and escaping document paths', async (t) => {
  const { root, brief } = await createFeatureReviewFixture(t);
  await assert.rejects(featureProjectChecks(root, 'example', { reviewedCommit: 'HEAD' }), /full commit SHA/);
  await assert.rejects(featureProjectChecks(root, 'example', { reviewedCommit: 'f'.repeat(40) }));
  const path = join(root, 'projects/example/PROJECT.md');
  await writeFile(path, brief.replace('[technical.md]', '[../outside.md]'));
  await assert.rejects(featureProjectChecks(root, 'example'), /invalid decision document path/);
  await writeFile(path, brief);
  await rm(join(root, 'projects/example/technical.md'));
  await writeFile(join(root, 'outside.md'), 'Unrelated private context.\n');
  await symlink(join(root, 'outside.md'), join(root, 'projects/example/technical.md'));
  await assert.rejects(featureProjectChecks(root, 'example'), /leaves Project/);
  assert.match((await checkWorkspace(root, { reviewedCommit: 'f'.repeat(40) })).failures.join('\n'), /requires --project/);
});


test('selected brief checking is scoped, requires real decisions, and rejects invalid Project types', async (t) => {
  const { root, brief } = await createFeatureReviewFixture(t);
  const path = join(root, 'projects/example/PROJECT.md');
  await mkdir(join(root, 'projects/unrelated'), { recursive: true });
  await writeFile(join(root, 'projects/unrelated/PROJECT.md'), 'Not in the selected scope.');
  assert.deepEqual((await checkWorkspace(root, { projectSlug: 'example' })).failures, []);
  await writeFile(path, brief.replace('type: project', 'type: unrelated'));
  assert.match((await checkWorkspace(root, { projectSlug: 'example' })).failures.join('\n'), /type: project/);
  await writeFile(path, brief.replace('Help a user find incomplete tasks.', '<!-- Fill this later -->'));
  assert.match((await checkWorkspace(root, { projectSlug: 'example' })).failures.join('\n'), /content under ## Intent/);
  await writeFile(path, brief + '\n[Missing evidence](missing.md)\n');
  assert.match((await checkWorkspace(root, { projectSlug: 'example' })).failures.join('\n'), /missing.md/);
});

test('new source-template copy supports setup and a filled brief without application configuration', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-template-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(templateRoot, root, { recursive: true, filter: path => !['.git', 'node_modules'].includes(path.split('/').at(-1)) });
  assert.deepEqual((await checkWorkspace(root)).failures, []);
  const raw = await readFile(join(root, '_templates/project/PROJECT.md'), 'utf8');
  const template = parseFrontmatter('_templates/project/PROJECT.md', raw);
  assert.equal(Object.hasOwn(template, 'workflow'), false);
  await mkdir(join(root, 'projects/first-outcome'), { recursive: true });
  const path = join(root, 'projects/first-outcome/PROJECT.md');
  let brief = raw.replace('id:', 'id: first-outcome').replace('title:', 'title: First outcome');
  await writeFile(path, brief);
  assert.match((await checkWorkspace(root)).failures.join('\n'), /content under ## Intent/);
  const decisions = {
    Intent: 'Find saved tasks.',
    'Product behavior': 'Filter the list using its existing search field.',
    'Technical choices': 'Reuse the existing query owner.',
    'Acceptance and proof': 'A matching saved task appears after search; a nonmatching task does not.',
    'Open questions': 'None.',
    Links: 'Implementation and review will be linked from the owning PR when created.',
  };
  // Instantiation removes the instructional preamble and fills actual decision sections.
  brief = brief.slice(0, brief.indexOf('# Feature brief')) + '# First outcome\n\n'
    + Object.entries(decisions).map(([heading, text]) => `## ${heading}\n\n${text}\n`).join('\n');
  await writeFile(path, brief);
  assert.deepEqual((await checkWorkspace(root)).failures, []);
  await writeFile(path, brief.replace('type: project', 'type: unrelated'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /type: project/);
});

test('workspace validation detects broken routes, profile selections, and invalid full-gate configuration', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-routing-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(templateRoot, root, { recursive: true, filter: path => !['.git', 'node_modules'].includes(path.split('/').at(-1)) });
  const templatePath = join(root, '_templates/project/PROJECT.md');
  const template = await readFile(templatePath, 'utf8');
  await writeFile(templatePath, template.replace('type: project', 'type: unrelated').replace('## Intent', '## Missing intent'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /type: project/);
  assert.match((await checkWorkspace(root)).failures.join('\n'), /missing ## Intent/);
  await writeFile(templatePath, template);
  const profilePath = join(root, '_shared/engineering/profiles/direct-repository.md');
  const profile = await readFile(profilePath, 'utf8');
  await writeFile(profilePath, profile.replace('`RULE-SOURCE`', '`RULE-MISSING`'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /RULE-MISSING/);
  await writeFile(profilePath, profile);
  const routePath = join(root, 'workflows/CONTEXT.md');
  const route = await readFile(routePath, 'utf8');
  await writeFile(routePath, route.replace('(01_understand/CONTEXT.md)', '(missing/CONTEXT.md)'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /unreachable|missing/);
  await writeFile(routePath, route);
  const configPath = join(root, 'icm.config.json');
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  config.candidateGate.enabled = true;
  await writeFile(configPath, JSON.stringify(config));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /requires at least one phase/);
});

test('brief metadata cannot hide duplicated authority fields or unparsed entries', () => {
  assert.throws(() => parseFrontmatter('PROJECT.md', '---\ntitle: First\ntitle: Second\n---\n'), /duplicate/);
  assert.throws(() => parseFrontmatter('PROJECT.md', '---\ntype: project\n  approved: true\n---\n'), /unparsed/);
});

test('checker CLI rejects unsupported flags and review comparison without a selected Project', async () => {
  const command = join(templateRoot, 'tools/icm/workspace-check.mjs');
  await assert.rejects(exec(process.execPath, [command, '--unknown']), error => error.code === 1 && /Usage/.test(error.stderr));
  await assert.rejects(exec(process.execPath, [command, '--reviewed-commit', 'f'.repeat(40)]), error => error.code === 1 && /requires --project/.test(error.stderr));
});

test('brief and template validation reject ambiguous or wrongly nested decision sections', async (t) => {
  const { root, brief } = await createFeatureReviewFixture(t);
  const path = join(root, 'projects/example/PROJECT.md');
  for (const replacement of ['# Intent', '### Intent', '## Intent\n\nFirst owner.\n\n## Intent — details']) {
    await writeFile(path, brief.replace('## Intent', replacement));
    const result = await checkWorkspace(root, { projectSlug: 'example' });
    assert.match(result.failures.join('\n'), /must use ## Intent|repeats ## Intent/, replacement);
  }

  const templateRootCopy = await mkdtemp(join(tmpdir(), 'icm-brief-shape-'));
  t.after(() => rm(templateRootCopy, { recursive: true, force: true }));
  await cp(templateRoot, templateRootCopy, { recursive: true, filter: entry => !['.git', 'node_modules'].includes(entry.split('/').at(-1)) });
  const templatePath = join(templateRootCopy, '_templates/project/PROJECT.md');
  const template = await readFile(templatePath, 'utf8');
  for (const replacement of ['# Intent', '### Intent', '## Intent\n\n## Intent — details']) {
    await writeFile(templatePath, template.replace('## Intent', replacement));
    const result = await checkWorkspace(templateRootCopy);
    assert.match(result.failures.join('\n'), /must use ## Intent|repeats ## Intent/, replacement);
  }
});

test('human-call wiring rejects missing skills, wrong owners, and lost shared routes', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-human-call-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(templateRoot, root, { recursive: true, filter: path => !['.git', 'node_modules'].includes(path.split('/').at(-1)) });
  assert.deepEqual((await checkWorkspace(root)).failures, []);
  const canonical = '.agents/skills/human-call/SKILL.md';
  const adapter = '.claude/skills/human-call/SKILL.md';
  for (const path of [canonical, adapter]) {
    const fullPath = join(root, path);
    const original = await readFile(fullPath, 'utf8');
    await rm(fullPath);
    assert.ok((await checkWorkspace(root)).failures.some(failure => failure.includes(`${path} is required`)));
    await writeFile(fullPath, original.replace('name: human-call', 'name: unrelated'));
    assert.ok((await checkWorkspace(root)).failures.some(failure => failure.includes(path) && failure.includes('name')));
    await writeFile(fullPath, original.replace(/^description:.*$/m, 'description:'));
    assert.ok((await checkWorkspace(root)).failures.some(failure => failure.includes(path) && failure.includes('describe')));
    await writeFile(fullPath, original);
  }
  for (const path of [adapter, '_shared/engineering/decision-work.md', '_shared/engineering/safeguards.md']) {
    const fullPath = join(root, path);
    const original = await readFile(fullPath, 'utf8');
    // The replacement still resolves: ordinary broken-link checks cannot detect a wrong owner.
    const wrongOwner = path === adapter ? '../../../README.md' : '../../README.md';
    await writeFile(fullPath, original.replace(/\]\([^)]*\.agents\/skills\/human-call\/SKILL\.md\)/, `](${wrongOwner})`));
    assert.ok((await checkWorkspace(root)).failures.some(failure => failure.includes(path) && failure.includes('must link')));
    await writeFile(fullPath, original);
  }
  const adapterPath = join(root, adapter);
  const original = await readFile(adapterPath, 'utf8');
  await writeFile(adapterPath, original.replace('../../../.agents/', '../../../.agents/skills/../').replace('This adapter owns no decision procedure.', 'The linked skill owns the procedure.'));
  assert.deepEqual((await checkWorkspace(root)).failures, [], 'equivalent link spelling and prose are not policy drift');
});


test('delivery skill adapters must keep their canonical identity and target', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-delivery-skills-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(templateRoot, root, { recursive: true, filter: path => !['.git', 'node_modules'].includes(path.split('/').at(-1)) });
  for (const name of ['integration-review', 'to-tickets']) {
    const path = join(root, `.claude/skills/${name}/SKILL.md`);
    const original = await readFile(path, 'utf8');
    await writeFile(path, original.replace(`.agents/skills/${name}/`, '.agents/skills/human-call/'));
    assert.ok((await checkWorkspace(root)).failures.some(failure => failure.includes(name) && failure.includes('must link')));
    await writeFile(path, original);
  }
  assert.deepEqual((await checkWorkspace(root)).failures, []);
});


test('changed checking includes staged, restored, untracked paths and incoming links', async (t) => {
  const { root, reviewedCommit } = await createFeatureReviewFixture(t);
  await writeFile(join(root, 'projects/example/technical.md'), 'Changed decision.\n');
  await git(root, 'add', '.');
  await writeFile(join(root, 'projects/example/technical.md'), 'Reuse the task query.\n');
  await writeFile(join(root, 'projects/example/new.md'), 'New evidence.\n');
  let result = await checkWorkspace(root, { changedSince: reviewedCommit });
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.scope.paths, ['projects/example/new.md', 'projects/example/technical.md']);
  await writeFile(join(root, 'projects/example/technical.md'), '[Deleted evidence](new.md)\n');
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'Add evidence');
  const base = (await git(root, 'rev-parse', 'HEAD')).stdout.trim();
  await rm(join(root, 'projects/example/new.md'));
  result = await checkWorkspace(root, { changedSince: base });
  assert.ok(result.scope.affected.includes('projects/example/technical.md'));
  assert.match(result.failures.join('\n'), /links to missing new.md/);
  await writeFile(join(root, 'unknown.txt'), 'Unknown impact');
  result = await checkWorkspace(root, { changedSince: base });
  assert.equal(result.scope.mode, 'workspace');
  assert.match((await checkWorkspace(root, { changedSince: base, projectSlug: 'example' })).failures.join('\n'), /cannot be combined/);
});


test('review comparisons include context selectors and staged selector changes', async t => {
  const { root, brief } = await createFeatureReviewFixture(t);
  const path = join(root, 'projects/example/context.json');
  await writeFile(join(root, 'projects/example/PROJECT.md'), brief.replace('type: project', 'type: project\ncontext_packets: context.json'));
  const original = JSON.stringify({ schemaVersion: 1, nodes: [] });
  await writeFile(path, original);
  await git(root, 'add', '.'); await git(root, 'commit', '-m', 'Declare context selection');
  const reviewedCommit = (await git(root, 'rev-parse', 'HEAD')).stdout.trim();
  await writeFile(path, JSON.stringify({ schemaVersion: 1, nodes: [{ id: 'changed-scope' }] }));
  await git(root, 'add', '.');
  await writeFile(path, original);
  const result = await featureProjectChecks(root, 'example', { reviewedCommit });
  assert.deepEqual(result.comparison.changed, ['projects/example/context.json']);
  assert.equal(result.comparison.status, 'needs-review');
});

test('the current workflow rejects nested steps and requires stage-owned rule selections', async t => {
  const root = await mkdtemp(join(tmpdir(), 'icm-stage-contracts-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(templateRoot, root, { recursive: true, filter: path => !['.git', 'node_modules'].includes(path.split('/').at(-1)) });
  const nested = join(root, 'workflows/03_build/01_old-step');
  await mkdir(nested);
  assert.match((await checkWorkspace(root)).failures.join('\n'), /step folder/);
  await rm(nested, { recursive: true });
  const path = join(root, 'workflows/03_build/CONTEXT.md');
  const stage = await readFile(path, 'utf8');
  await writeFile(path, stage.replace('## Rules', '## Loading'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /own a ## Rules table/);
  await writeFile(path, stage.replace('`RULE-SOURCE`', '`RULE-MISSING`'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /RULE-MISSING/);
  // A second loader in frontmatter could contradict the Rules table.
  for (const key of ['profile', 'references', 'selectors', 'output_templates']) {
    await writeFile(path, stage.replace('context:\n', `context:\n  ${key}: []\n`));
    assert.match((await checkWorkspace(root)).failures.join('\n'), new RegExp(`unknown key ${key}`));
  }
  const design = join(root, 'workflows/02_design/CONTEXT.md');
  const designBody = await readFile(design, 'utf8');
  await writeFile(design, designBody.replace('_templates/adr.md', '_templates/missing-adr.md'));
  assert.match((await checkWorkspace(root)).failures.join('\n'), /missing-adr\.md does not exist/);
  await writeFile(design, designBody);
  await writeFile(path, stage);
  assert.deepEqual((await checkWorkspace(root)).failures, []);
});

test('each stage owns a distinct Rules table with no heading both always and conditionally loaded', async () => {
  const tables = new Set();
  for (const stage of ['01_understand', '02_design', '03_build', '04_validate', '05_assess-readiness', '06_release', '07_learn']) {
    const body = await readFile(join(templateRoot, 'workflows', stage, 'CONTEXT.md'), 'utf8');
    const rules = body.slice(body.indexOf('## Rules'));
    tables.add(rules.replace(/\]\([^)]*\)/g, ']()'));
    const seen = new Map();
    for (const line of rules.split('\n').filter(row => row.startsWith('| ['))) {
      const [, source, selection] = line.split('|').map(cell => cell.trim());
      const conditional = selection.startsWith('Conditional');
      for (const [, heading] of selection.matchAll(/`([^`]+)`/g)) {
        const key = `${source} ${heading}`;
        assert.ok(!seen.has(key) || seen.get(key) === conditional, `${stage} loads ${heading} both always and conditionally`);
        seen.set(key, conditional);
      }
    }
  }
  assert.equal(tables.size, 7, 'stages must not share one copied table');
});

test('briefs must not keep the retired workflow field', async t => {
  const root = await mkdtemp(join(tmpdir(), 'icm-workflow-field-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(templateRoot, root, { recursive: true, filter: path => !['.git', 'node_modules'].includes(path.split('/').at(-1)) });
  await mkdir(join(root, 'projects/example'), { recursive: true });
  const brief = '---\ntype: project\nid: example\ntitle: Example\nworkflow: feature-work\n---\n'
    + ['Intent', 'Product behavior', 'Technical choices', 'Acceptance and proof', 'Open questions', 'Links'].map(h => `## ${h}\n\nAccepted ${h}.\n`).join('\n');
  await writeFile(join(root, 'projects/example/PROJECT.md'), brief);
  assert.match((await featureProjectChecks(root, 'example')).failures.join('\n'), /must not declare workflow/);
  await writeFile(join(root, 'projects/example/PROJECT.md'), brief.replace('workflow: feature-work\n', ''));
  assert.deepEqual((await featureProjectChecks(root, 'example')).failures, []);
});

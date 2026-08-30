import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { checkWorkspace } from '../workspace-check.mjs';

async function write(root, path, body) {
  const target = join(root, path);
  await mkdir(join(target, '..'), { recursive: true });
  await writeFile(target, body);
}

function gitObjectId(root, body) {
  return execFileSync('git', ['-C', root, 'hash-object', '--stdin'], {
    encoding: 'utf8',
    input: body,
  }).trim();
}

async function writeMinimalConfig(root) {
  await write(root, 'icm.config.json', `${JSON.stringify({
    schemaVersion: 1,
    context: {
      commonPaths: [],
      limits: {
        hubTokens: 10000,
        routerTokens: 10000,
        stepTokens: 10000,
        packetTokens: 10000,
        reserveTokens: 0,
      },
      budgetScenarios: [],
    },
    candidateGate: {
      enabled: false,
      requireLinkedWorktree: false,
      phases: [],
      evidence: [],
      environmentProbes: [],
    },
    release: { allowedEnvironments: [] },
  })}\n`);
}

test('context budgets and reserve cannot be omitted from configuration', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-config-bounds-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'icm.config.json', `${JSON.stringify({
    schemaVersion: 1,
    context: {},
    candidateGate: {
      enabled: false,
      requireLinkedWorktree: false,
      phases: [],
      evidence: [],
      environmentProbes: [],
    },
    release: { allowedEnvironments: [] },
  })}\n`);

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  const failures = result.failures.join('\n');
  assert.match(failures, /context\.commonPaths must be a list/);
  for (const limit of [
    'hubTokens',
    'routerTokens',
    'stepTokens',
    'packetTokens',
    'reserveTokens',
  ]) assert.match(failures, new RegExp(`context limit ${limit} is required`));
  assert.match(failures, /context\.budgetScenarios must be a list/);
});

test('an approved downstream artifact requires its approved upstream artifact', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-upstream-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });

  await write(root, 'projects/example/PROJECT.md', [
    '---',
    'type: project',
    'id: example',
    'approval_contract: artifact-receipts',
    '---',
  ].join('\n'));
  await write(root, 'projects/example/specs/technical-spec.md', [
    '---',
    'type: technical-specification',
    'project: example',
    'status: approved',
    'product_specification: projects/example/specs/product-spec.md@0000000000000000000000000000000000000000',
    '---',
    '# Technical Specification',
  ].join('\n'));
  await write(root, 'projects/example/approvals/technical-specification.md', [
    '---',
    'type: approval-receipt',
    'project: example',
    'artifact: projects/example/specs/technical-spec.md',
    'artifact_blob: 0000000000000000000000000000000000000000',
    'decision: approved',
    'source: human-review:test',
    '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(
    result.failures.join('\n'),
    /technical specification is approved without an approved product specification/,
  );
});

test('an approved downstream artifact rejects a non-approved upstream artifact', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-non-approved-upstream-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });
  await write(root, 'projects/example/PROJECT.md', [
    '---', 'type: project', 'id: example', 'approval_contract: artifact-receipts', '---',
  ].join('\n'));
  const productBody = [
    '---', 'type: product-specification', 'project: example', 'status: draft',
    'decision_mode: single-track', 'selected_product_option:', '---',
    '# Product Specification', '', '## Product behavior options', '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|', '|  |  |  |  |  |',
  ].join('\n');
  await write(root, 'projects/example/specs/product-spec.md', productBody);
  const technicalBody = [
    '---', 'type: technical-specification', 'project: example', 'status: approved',
    `product_specification: projects/example/specs/product-spec.md@${gitObjectId(root, productBody)}`,
    '---', '# Technical Specification',
  ].join('\n');
  await write(root, 'projects/example/specs/technical-spec.md', technicalBody);
  await write(root, 'projects/example/approvals/technical-specification.md', [
    '---', 'type: approval-receipt', 'project: example',
    'artifact: projects/example/specs/technical-spec.md',
    `artifact_blob: ${gitObjectId(root, technicalBody)}`,
    'decision: approved', 'source: human-review:test', '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(result.failures.join('\n'), /technical specification is approved without an approved product specification/);
});

test('approval receipts reject stale artifact bytes', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-stale-receipt-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });
  await write(root, 'projects/example/PROJECT.md', [
    '---', 'type: project', 'id: example', 'approval_contract: artifact-receipts', '---',
  ].join('\n'));
  const productBody = [
    '---', 'type: product-specification', 'project: example', 'status: approved',
    'decision_mode: single-track', 'selected_product_option:', '---',
    '# Product Specification', '', '## Product behavior options', '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|', '|  |  |  |  |  |',
  ].join('\n');
  await write(root, 'projects/example/specs/product-spec.md', productBody);
  await write(root, 'projects/example/approvals/product-specification.md', [
    '---', 'type: approval-receipt', 'project: example',
    'artifact: projects/example/specs/product-spec.md',
    'artifact_blob: 0000000000000000000000000000000000000000',
    'decision: approved', 'source: human-review:test', '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(result.failures.join('\n'), /product-spec\.md does not match approved blob/);
});

test('approved downstream artifacts bind the exact upstream bytes', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-upstream-identity-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });
  await write(root, 'projects/example/PROJECT.md', [
    '---', 'type: project', 'id: example', 'approval_contract: artifact-receipts', '---',
  ].join('\n'));
  const productBody = [
    '---', 'type: product-specification', 'project: example', 'status: approved',
    'decision_mode: single-track', 'selected_product_option:', '---',
    '# Product Specification', '', '## Product behavior options', '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|', '|  |  |  |  |  |',
  ].join('\n');
  const productBlob = gitObjectId(root, productBody);
  await write(root, 'projects/example/specs/product-spec.md', productBody);
  await write(root, 'projects/example/approvals/product-specification.md', [
    '---', 'type: approval-receipt', 'project: example',
    'artifact: projects/example/specs/product-spec.md', `artifact_blob: ${productBlob}`,
    'decision: approved', 'source: human-review:test', '---',
  ].join('\n'));
  const technicalBody = [
    '---', 'type: technical-specification', 'project: example', 'status: approved',
    'product_specification: projects/example/specs/product-spec.md@0000000000000000000000000000000000000000',
    '---', '# Technical Specification',
  ].join('\n');
  await write(root, 'projects/example/specs/technical-spec.md', technicalBody);
  await write(root, 'projects/example/approvals/technical-specification.md', [
    '---', 'type: approval-receipt', 'project: example',
    'artifact: projects/example/specs/technical-spec.md',
    `artifact_blob: ${gitObjectId(root, technicalBody)}`,
    'decision: approved', 'source: human-review:test', '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(
    result.failures.join('\n'),
    new RegExp(`technical-spec\\.md must reference projects/example/specs/product-spec\\.md@${productBlob}`),
  );
});

test('an approved technical design selects exactly one option row', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-selected-design-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });
  await write(root, 'projects/example/PROJECT.md', [
    '---', 'type: project', 'id: example', 'approval_contract: artifact-receipts', '---',
  ].join('\n'));
  const productBody = [
    '---', 'type: product-specification', 'project: example', 'status: approved',
    'decision_mode: single-track', 'selected_product_option:', '---',
    '# Product Specification', '', '## Product behavior options', '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|', '|  |  |  |  |  |',
  ].join('\n');
  const productBlob = gitObjectId(root, productBody);
  await write(root, 'projects/example/specs/product-spec.md', productBody);
  await write(root, 'projects/example/approvals/product-specification.md', [
    '---', 'type: approval-receipt', 'project: example',
    'artifact: projects/example/specs/product-spec.md', `artifact_blob: ${productBlob}`,
    'decision: approved', 'source: human-review:test', '---',
  ].join('\n'));
  const technicalBody = [
    '---', 'type: technical-specification', 'project: example', 'status: approved',
    `product_specification: projects/example/specs/product-spec.md@${productBlob}`,
    '---', '# Technical Specification', '', '## Design options and decision', '',
    '| Option | Decision |', '|---|---|', '| Reuse | Selected |', '| Replace | Selected |',
  ].join('\n');
  await write(root, 'projects/example/specs/technical-spec.md', technicalBody);
  await write(root, 'projects/example/approvals/technical-specification.md', [
    '---', 'type: approval-receipt', 'project: example',
    'artifact: projects/example/specs/technical-spec.md',
    `artifact_blob: ${gitObjectId(root, technicalBody)}`,
    'decision: approved', 'source: human-review:test', '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(result.failures.join('\n'), /must mark exactly one Design options and decision row Selected/);
});

test('single-track product intent cannot retain Product option rows', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-single-track-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });

  await write(root, 'projects/example/PROJECT.md', [
    '---',
    'type: project',
    'id: example',
    'approval_contract: artifact-receipts',
    '---',
  ].join('\n'));
  await write(root, 'projects/example/specs/product-spec.md', [
    '---',
    'type: product-specification',
    'project: example',
    'status: draft',
    'decision_mode: single-track',
    'selected_product_option:',
    '---',
    '# Product Specification',
    '',
    '## Product behavior options',
    '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|',
    '| P1 | Keep one behavior | Simpler choice | No comparison | Selected |',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(
    result.failures.join('\n'),
    /decision_mode: single-track but defines Product option rows/,
  );
});

test('Projects cannot bypass approval verification with a missing contract', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-approval-contract-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'projects/example/PROJECT.md', [
    '---',
    'type: project',
    'id: example',
    '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(
    result.failures.join('\n'),
    /projects\/example\/PROJECT\.md must declare approval_contract: artifact-receipts/,
  );
});

test('a Project directory cannot omit its canonical Project record', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-missing-project-record-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'projects/example/specs/product-spec.md', [
    '---', 'type: product-specification', 'project: example', 'status: approved', '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(result.failures.join('\n'), /projects\/example\/PROJECT\.md is required/);
});

test('Project directory symlinks cannot escape approval verification', async (t) => {
  const parent = await mkdtemp(join(tmpdir(), 'icm-project-symlink-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(parent, { recursive: true })));
  const root = join(parent, 'repository');
  const outside = join(parent, 'outside-project');
  await mkdir(join(root, 'projects'), { recursive: true });
  await mkdir(outside, { recursive: true });
  await write(outside, 'PROJECT.md', [
    '---', 'type: project', 'id: example', 'approval_contract: artifact-receipts', '---',
  ].join('\n'));
  await symlink(
    outside,
    join(root, 'projects/example'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.match(result.failures.join('\n'), /Project symlinks are not allowed/);
});

test('Project and artifact identities must match their canonical paths', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-artifact-identity-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', root], { stdio: 'ignore' });
  await write(root, 'projects/alpha/PROJECT.md', [
    '---',
    'type: project',
    'id: beta',
    'approval_contract: artifact-receipts',
    '---',
  ].join('\n'));
  await write(root, 'projects/alpha/specs/product-spec.md', [
    '---',
    'type: wrong-type',
    'project: beta',
    'status: draft',
    'decision_mode: single-track',
    'selected_product_option:',
    '---',
    '# Product Specification',
    '',
    '## Product behavior options',
    '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|',
    '|  |  |  |  |  |',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  const failures = result.failures.join('\n');
  assert.match(failures, /PROJECT\.md id beta must match directory alpha/);
  assert.match(failures, /product-spec\.md must declare type: product-specification/);
  assert.match(failures, /product-spec\.md names Project beta, expected alpha/);
});

test('approval receipts accept the repository Git object format', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-sha256-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  execFileSync('git', ['init', '--object-format=sha256', root], { stdio: 'ignore' });
  await writeMinimalConfig(root);

  await write(root, 'projects/example/PROJECT.md', [
    '---',
    'type: project',
    'id: example',
    'approval_contract: artifact-receipts',
    '---',
  ].join('\n'));
  const productBody = [
    '---',
    'type: product-specification',
    'project: example',
    'status: approved',
    'decision_mode: single-track',
    'selected_product_option:',
    '---',
    '# Product Specification',
    '',
    '## Product behavior options',
    '',
    '| ID | Candidate behavior | Product benefit | Accepted sacrifice or weakness | Status |',
    '|---|---|---|---|---|',
    '|  |  |  |  |  |',
  ].join('\n');
  await write(root, 'projects/example/specs/product-spec.md', productBody);
  const oid = execFileSync('git', ['-C', root, 'hash-object', '--stdin'], {
    encoding: 'utf8',
    input: productBody,
  }).trim();
  assert.equal(oid.length, 64, 'fixture must use SHA-256 Git object IDs');
  await write(root, 'projects/example/approvals/product-specification.md', [
    '---',
    'type: approval-receipt',
    'project: example',
    'artifact: projects/example/specs/product-spec.md',
    `artifact_blob: ${oid}`,
    'decision: approved',
    'source: human-review:test',
    '---',
  ].join('\n'));

  const result = await checkWorkspace(root, { checkWorkflowContracts: false });
  assert.deepEqual(result.failures, []);
});

test('conditional selectors require an explicit manifest trigger', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-selector-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/engineering/profiles/direct-repository.md',
    '    heading: 01_understand',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '  selectors:',
    '    - path: _shared/domain/CONTEXT.md',
    '---',
    '# Understand',
  ].join('\n'));

  const result = await checkWorkspace(root);
  assert.match(
    result.failures.join('\n'),
    /selector _shared\/domain\/CONTEXT\.md must declare when/,
  );
});

test('workspace links and workflow routes must resolve', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-routing-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'README.md', '# Workspace\n\n[Missing](missing.md)\n');
  await write(root, 'workflows/CONTEXT.md', [
    '---',
    'type: workflow-hub',
    '---',
    '# Workflow hub',
  ].join('\n'));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/engineering/profiles/direct-repository.md',
    '    heading: 01_understand',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '---',
    '# Understand',
  ].join('\n'));
  await write(root, '_shared/engineering/profiles/direct-repository.md', [
    '# Profiles',
    '',
    '## 01_understand',
  ].join('\n'));

  const result = await checkWorkspace(root);
  assert.match(result.failures.join('\n'), /README\.md links to missing missing\.md/);
  assert.match(result.failures.join('\n'), /workflows\/01_understand\/CONTEXT\.md is unreachable/);
});

test('the root context directly exposes every workspace route', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-root-routes-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'CONTEXT.md', [
    '# Workspace',
    '',
    '[Setup](setup/CONTEXT.md)',
    '[Projects](projects/CONTEXT.md)',
    '[Workflows](workflows/CONTEXT.md)',
    '[Shared](_shared/CONTEXT.md)',
    '[Roadmap](roadmap/CONTEXT.md)',
    '[Architecture](architecture/CONTEXT.md)',
  ].join('\n'));
  await write(root, 'AGENTS.md', [
    'Read setup/questionnaire.md, then CONTEXT.md.',
    'For direct work use _shared/engineering/profiles/direct-repository.md#direct-repository.',
  ].join('\n'));

  const result = await checkWorkspace(root);
  assert.match(result.failures.join('\n'), /CONTEXT\.md must link directly to app\/README\.md/);
});

test('workflow manifests validate profile and selected reference headings', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-manifest-target-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/engineering/profiles/direct-repository.md',
    '    heading: missing-profile',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '  references:',
    '    - path: _shared/reference.md',
    '      headings: [Missing heading]',
    '---',
    '# Understand',
  ].join('\n'));
  await write(root, '_shared/engineering/profiles/direct-repository.md', '# Profiles\n\n## existing-profile\n');
  await write(root, '_shared/reference.md', '# Reference\n\n## Existing heading\n');

  const result = await checkWorkspace(root);
  assert.match(result.failures.join('\n'), /profile heading missing-profile/);
  assert.match(result.failures.join('\n'), /_shared\/reference\.md is missing selected heading Missing heading/);
});

test('workflow profile paths cannot escape the repository', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-profile-path-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: ../../outside.md',
    '    heading: profile',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '---',
    '# Understand',
  ].join('\n'));

  const result = await checkWorkspace(root);
  assert.match(result.failures.join('\n'), /invalid profile path \.\.\/\.\.\/outside\.md/);
});

test('workflow profile symlinks cannot escape the repository', async (t) => {
  const parent = await mkdtemp(join(tmpdir(), 'icm-profile-symlink-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(parent, { recursive: true })));
  const root = join(parent, 'repository');
  await mkdir(join(root, '_shared'), { recursive: true });
  const outside = join(parent, 'outside.md');
  await writeFile(outside, '# Outside\n\n## profile\n');
  await symlink(outside, join(root, '_shared/profile.md'));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/profile.md',
    '    heading: profile',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '---',
    '# Understand',
  ].join('\n'));

  const result = await checkWorkspace(root);
  assert.match(result.failures.join('\n'), /resolves outside the repository through a symlink/);
});

test('working contracts require explicit jobs, boundaries, outputs, and gates', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-contract-shape-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/profile.md',
    '    heading: understand',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '---',
    '# Incomplete contract',
  ].join('\n'));
  await write(root, '_shared/profile.md', '# Profile\n\n## understand\n');

  const result = await checkWorkspace(root);
  const failures = result.failures.join('\n');
  assert.match(failures, /missing required contract marker One job:/);
  assert.match(failures, /missing required contract marker ## Human check/);
});

test('context packets preserve the configured reserve', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-packet-budget-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'icm.config.json', `${JSON.stringify({
    schemaVersion: 1,
    context: {
      commonPaths: ['AGENTS.md'],
      limits: { stepTokens: 1000, packetTokens: 30, reserveTokens: 10 },
    },
  })}\n`);
  await write(root, 'AGENTS.md', '# Instructions\n\nThis common context deliberately consumes the small packet budget.\n');
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/engineering/profiles/direct-repository.md',
    '    heading: 01_understand',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '---',
    '# Understand',
    '',
    'This working contract also consumes packet context.',
  ].join('\n'));
  await write(root, '_shared/engineering/profiles/direct-repository.md', '# Profiles\n\n## 01_understand\n\nSelected rules.\n');

  const result = await checkWorkspace(root);
  assert.match(result.failures.join('\n'), /context packet plus 10-token reserve exceeds 30 tokens/);
});

test('context budget scenarios include declared conditional selectors', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'icm-selector-budget-'));
  t.after(() => import('node:fs/promises').then(({ rm }) => rm(root, { recursive: true })));
  await write(root, 'icm.config.json', `${JSON.stringify({
    schemaVersion: 1,
    context: {
      commonPaths: [],
      limits: {
        hubTokens: 1000,
        routerTokens: 1000,
        stepTokens: 1000,
        packetTokens: 900,
        reserveTokens: 10,
      },
      budgetScenarios: [{
        name: 'conditional-ui',
        contract: 'workflows/01_understand/CONTEXT.md',
        selectors: ['_shared/ux.md'],
      }],
    },
    candidateGate: {
      enabled: false,
      requireLinkedWorktree: false,
      phases: [],
      evidence: [],
      environmentProbes: [],
    },
    release: { allowedEnvironments: [] },
  })}\n`);
  await write(root, 'workflows/CONTEXT.md', [
    '---', 'type: workflow-hub', '---', '# Hub', '',
    '[Understand](01_understand/CONTEXT.md)',
  ].join('\n'));
  await write(root, 'workflows/01_understand/CONTEXT.md', [
    '---',
    'type: workflow-step',
    'context:',
    '  profile:',
    '    path: _shared/profile.md',
    '    heading: understand',
    '  inputs:',
    '    - path: projects/<project-slug>/PROJECT.md',
    '  selectors:',
    '    - path: _shared/ux.md',
    '      when: interface work is in scope',
    '---',
    '# Understand',
  ].join('\n'));
  await write(root, '_shared/profile.md', '# Profile\n\n## understand\n\nRules.\n');
  await write(root, '_shared/ux.md', `# UX\n\n${'Conditional interface evidence. '.repeat(80)}\n`);
  await write(root, 'projects/example/PROJECT.md', [
    '---',
    'type: project',
    'id: example',
    'approval_contract: artifact-receipts',
    '---',
    '# Example Project',
    '',
    '## Context',
    '',
    'Project-specific accepted detail. '.repeat(80),
  ].join('\n'));

  const result = await checkWorkspace(root);
  assert.doesNotMatch(
    result.failures.join('\n'),
    /budget scenario conditional-ui plus 10-token reserve exceeds 900 tokens/,
  );
  assert.match(
    result.failures.join('\n'),
    /budget scenario conditional-ui for Project example plus 10-token reserve exceeds 900 tokens/,
  );
});

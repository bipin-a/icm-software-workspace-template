import assert from 'node:assert/strict';
import test from 'node:test';
import { deliveryModel, metadata, renderDelivery, replaceView, syncDelivery } from '../delivery.mjs';
const repo = 'example/software';
const block = (kind, value) => `Human introduction.\n\n<!-- icm-${kind}\n${JSON.stringify(value)}\n-->\n\nHuman conclusion.`;
const slice = (blockedBy = [], extra = {}) => ({ priority: 1, blockedBy, pullRequest: null, releaseBlocking: true, owners: ['app/search'], mergeConditions: [], humanGates: [], ...extra });
const issue = (number, spec) => ({ number, html_url: `https://github.com/${repo}/issues/${number}`, title: 'Useful | result <tag>', state: 'open', state_reason: null, body: block('slice', spec) });
function fixture() {
  const parent = issue(1, slice());
  parent.body = block('delivery', { integrationPullRequest: 10, baseBranch: 'main', issues: [2, 3, 4] });
  const integration = { number: 10, html_url: `https://github.com/${repo}/pull/10`, state: 'open', draft: true, merged: false, body: 'Human PR text.', head: { ref: 'integration', repo: { full_name: repo } }, base: { ref: 'main', repo: { full_name: repo } } };
  return { repo, parent, integration, issues: [issue(2, slice()), issue(3, slice([2])), issue(4, slice([], { priority: 2 }))], pulls: [] };
}
function service(data) {
  const writes = [];
  const request = async (method, path, payload) => {
    const match = path.match(/\/(issues|pulls)\/(\d+)$/);
    assert.ok(match);
    const number = Number(match[2]);
    const item = [data.parent, data.integration, ...data.issues, ...data.pulls].find(item => item.number === number);
    if (!item) throw new Error('Not found');
    if (method === 'PATCH') { writes.push({ path, payload }); item.body = payload.body; }
    return structuredClone(item);
  };
  return { request, writes };
}

test('delivery projects priority, prerequisite frontier, critical chain, and ownership overlap', () => {
  const data = fixture();
  const model = deliveryModel(data);
  assert.deepEqual(model.frontier, [2, 4]);
  assert.deepEqual(model.criticalPath, [2, 3]);
  assert.deepEqual(model.conflicts, [[2, 4]]);
  const view = renderDelivery(model);
  assert.match(view, /Useful &#124; result &lt;tag&gt;/);
  assert.match(view, /issue2 --> issue3/);
  data.issues[0].state = 'closed'; data.issues[0].state_reason = 'not_planned';
  assert.ok(!deliveryModel(data).frontier.includes(3), 'cancelled work cannot satisfy a dependency');
  data.issues[0].state_reason = 'completed';
  assert.deepEqual(deliveryModel(data).frontier, [3, 4]);
});

test('delivery rejects missing blockers, cycles, malformed metadata, and wrong PR bases', () => {
  const data = fixture();
  data.issues[0].body = block('slice', slice([99]));
  assert.throws(() => deliveryModel(data), /Missing blocker/);
  data.issues[0].body = block('slice', slice([3]));
  assert.throws(() => deliveryModel(data), /cycle/);
  data.issues[0].body = block('slice', slice([], { pullRequest: 11 }));
  data.pulls = [{ ...structuredClone(data.integration), number: 11, html_url: `https://github.com/${repo}/pull/11` }];
  assert.throws(() => deliveryModel(data), /must target integration/);
  assert.throws(() => metadata(data.parent.body + data.parent.body, 'delivery'), /Exactly one/);
  data.pulls[0].base.ref = 'integration';
  data.issues[0].state = 'closed'; data.issues[0].state_reason = 'completed';
  assert.equal(deliveryModel(data).nodes[0].done, false, 'unmerged PR is not integrated completion');
  data.pulls[0].merged = true;
  assert.equal(deliveryModel(data).nodes[0].done, true);
});

test('human build gates stop frontier work without inferring approval from empty later gates', () => {
  const data = fixture();
  data.issues[0].body = block('slice', slice([], { humanGates: [{ phase: 'build', question: 'Choose ownership' }] }));
  assert.deepEqual(deliveryModel(data).frontier, [4]);
  data.issues[0].body = block('slice', slice([], { humanGates: [{ phase: 'release', question: 'Authorize deployment' }] }));
  assert.deepEqual(deliveryModel(data).frontier, [2, 4]);
  assert.match(renderDelivery(deliveryModel(data)), /release: Authorize deployment/);
});

test('generated regions preserve all surrounding prose and reject ambiguous markers', () => {
  const before = 'Opening.\n<!-- icm-delivery-view:start -->\nOld\n<!-- icm-delivery-view:end -->\nClosing.';
  const after = replaceView(before, 'New');
  assert.equal(after, before.replace('Old', 'New'));
  assert.equal(replaceView(after, 'New'), after);
  assert.throws(() => replaceView(before + before, 'New'), /duplicate/);
  assert.throws(() => replaceView('<!-- icm-delivery-view:end -->', 'New'), /Malformed/);
});

test('preview performs no writes; publishing updates and verifies both views idempotently', async () => {
  const data = fixture(), api = service(data);
  const options = { repo, parent: 1, request: api.request };
  const preview = await syncDelivery(options);
  assert.equal(preview.updates.length, 2);
  assert.equal(api.writes.length, 0);
  const published = await syncDelivery({ ...options, publish: true });
  assert.deepEqual(published.updated, [1, 10]);
  assert.match(data.parent.body, /^Human introduction/);
  assert.match(data.parent.body, /Human conclusion/);
  assert.deepEqual((await syncDelivery({ ...options, publish: true })).updated, []);
  assert.equal(api.writes.length, 2);
});

test('publication rejects stale sources and reports partial writes honestly', async () => {
  let data = fixture(), api = service(data), gets = 0;
  const request = async (method, path, payload) => {
    if (method === 'GET' && path.endsWith('/issues/1') && ++gets === 2) data.parent.body += '\nHuman edit.';
    return api.request(method, path, payload);
  };
  await assert.rejects(syncDelivery({ repo, parent: 1, request, publish: true }), /source changed/);
  assert.equal(api.writes.length, 0);
  data = fixture(); api = service(data);
  await assert.rejects(syncDelivery({ repo, parent: 1, publish: true, request: (method, path, payload) => {
    if (method === 'PATCH' && path.endsWith('/10')) throw new Error('Connection lost');
    return api.request(method, path, payload);
  } }), /verified updates: 1.*last attempted write may have applied/);
  assert.equal(api.writes.length, 1);
  assert.deepEqual((await syncDelivery({ repo, parent: 1, publish: true, request: api.request })).updated, [10]);
});


test('canonical coordination metadata cannot be inside a replaceable generated view', () => {
  const data = fixture();
  data.parent.body = `<!-- icm-delivery-view:start -->\n${data.parent.body}\n<!-- icm-delivery-view:end -->`;
  assert.throws(() => deliveryModel(data), /outside the generated/);
});

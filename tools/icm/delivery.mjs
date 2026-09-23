import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const START = '<!-- icm-delivery-view:start -->';
const END = '<!-- icm-delivery-view:end -->';
const positive = value => Number.isSafeInteger(value) && value > 0;
const list = value => Array.isArray(value) && value.every(positive) && new Set(value).size === value.length;
const textList = value => Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim());

export function metadata(body, kind) {
  const start = `<!-- icm-${kind}\n`, end = '\n-->';
  if (typeof body !== 'string' || body.split(start).length !== 2) throw new Error(`Exactly one icm-${kind} metadata block is required`);
  const metadataStart = body.indexOf(start);
  const viewStart = body.indexOf(START), viewEnd = body.indexOf(END);
  if (viewStart >= 0 && (viewEnd < 0 || (metadataStart > viewStart && metadataStart < viewEnd))) {
    throw new Error('Canonical metadata must stay outside the generated delivery view');
  }
  const tail = body.split(start)[1];
  const index = tail.indexOf(end);
  if (index < 0) throw new Error(`Unclosed icm-${kind} metadata block`);
  if (viewStart > metadataStart && viewStart < metadataStart + start.length + index) throw new Error('Canonical metadata overlaps generated delivery markers');
  return JSON.parse(tail.slice(0, index));
}

function keys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).some(key => !expected.includes(key))
    || expected.some(key => !Object.hasOwn(value, key))) throw new Error(`${label} has missing or unknown fields`);
}

export function replaceView(body, view) {
  body ??= '';
  const starts = body.split(START).length - 1, ends = body.split(END).length - 1;
  if (!starts && !ends) return `${body}${body.endsWith('\n') ? '\n' : '\n\n'}${START}\n${view}\n${END}\n`;
  if (starts !== 1 || ends !== 1 || body.indexOf(START) > body.indexOf(END)) throw new Error('Malformed or duplicate generated delivery markers');
  return body.slice(0, body.indexOf(START)) + `${START}\n${view}\n${END}` + body.slice(body.indexOf(END) + END.length);
}

function issueIdentity(item, number, repo, pull = false) {
  if (item?.number !== number || item.html_url !== `https://github.com/${repo}/${pull ? 'pull' : 'issues'}/${number}`
    || !['open', 'closed'].includes(item.state) || (!pull && item.pull_request)) throw new Error(`Invalid ${pull ? 'PR' : 'issue'} identity #${number}`);
}

export function deliveryModel({ repo, parent, integration, issues, pulls }) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw new Error('Use an explicit owner/repository');
  issueIdentity(parent, parent.number, repo);
  const plan = metadata(parent.body, 'delivery');
  keys(plan, ['integrationPullRequest', 'baseBranch', 'issues'], 'Delivery metadata');
  if (!positive(plan.integrationPullRequest) || !list(plan.issues) || !plan.issues.length
    || plan.issues.includes(parent.number) || typeof plan.baseBranch !== 'string' || !plan.baseBranch.trim()) throw new Error('Invalid delivery metadata');
  issueIdentity(integration, plan.integrationPullRequest, repo, true);
  if (integration.base?.repo?.full_name !== repo || integration.head?.repo?.full_name !== repo
    || integration.base.ref !== plan.baseBranch || !integration.head.ref || integration.head.ref === plan.baseBranch) throw new Error('Integration PR must connect the declared integration branch to the declared trunk');
  if (issues.length !== plan.issues.length || new Set(issues.map(i => i.number)).size !== issues.length) throw new Error('Delivery issue inventory does not match metadata');
  const nodes = new Map();
  const usedPulls = new Set();
  for (const issue of issues) {
    if (!plan.issues.includes(issue.number)) throw new Error(`Unexpected issue #${issue.number}`);
    issueIdentity(issue, issue.number, repo);
    const spec = metadata(issue.body, 'slice');
    keys(spec, ['priority', 'blockedBy', 'pullRequest', 'releaseBlocking', 'owners', 'mergeConditions', 'humanGates'], `Slice #${issue.number}`);
    if (!positive(spec.priority) || !list(spec.blockedBy) || !(spec.pullRequest === null || positive(spec.pullRequest))
      || typeof spec.releaseBlocking !== 'boolean' || !textList(spec.owners) || !spec.owners.length
      || spec.owners.some(p => p.startsWith('/') || /[\\\s]/.test(p) || p.split('/').some(x => !x || x === '..' || x === '.'))
      || !textList(spec.mergeConditions) || !Array.isArray(spec.humanGates)
      || spec.humanGates.some(g => !g || Object.keys(g).length !== 2 || !['build', 'merge', 'release'].includes(g.phase) || typeof g.question !== 'string' || !g.question.trim())) throw new Error(`Invalid slice metadata #${issue.number}`);
    let pull = null;
    if (spec.pullRequest !== null) {
      if (usedPulls.has(spec.pullRequest) || spec.pullRequest === integration.number) throw new Error('A child PR must belong to exactly one slice');
      usedPulls.add(spec.pullRequest);
      pull = pulls.find(p => p.number === spec.pullRequest);
      issueIdentity(pull, spec.pullRequest, repo, true);
      if (pull.base?.repo?.full_name !== repo || pull.base.ref !== integration.head.ref) throw new Error(`Child PR #${pull.number} must target ${integration.head.ref}`);
    }
    const done = issue.state === 'closed' && issue.state_reason === 'completed' && (!pull || pull.merged === true);
    nodes.set(issue.number, { issue, spec, pull, done });
  }
  const ordered = [], visiting = new Set(), visited = new Set();
  const visit = number => {
    if (!nodes.has(number)) throw new Error(`Missing blocker issue #${number}`);
    if (visiting.has(number)) throw new Error(`Dependency cycle at #${number}`);
    if (visited.has(number)) return;
    visiting.add(number); nodes.get(number).spec.blockedBy.forEach(visit);
    visiting.delete(number); visited.add(number); ordered.push(number);
  };
  plan.issues.forEach(visit);
  const frontier = [...nodes.values()].filter(n => !n.done && n.issue.state === 'open'
    && (!n.pull || n.pull.state === 'open') && !n.spec.humanGates.some(g => g.phase === 'build')
    && n.spec.blockedBy.every(id => nodes.get(id).done))
    .sort((a, b) => a.spec.priority - b.spec.priority || a.issue.number - b.issue.number).map(n => n.issue.number);
  const chains = new Map();
  for (const id of ordered) {
    const n = nodes.get(id);
    const previous = n.spec.blockedBy.map(dep => chains.get(dep)).sort((a, b) => b.length - a.length)[0] ?? [];
    chains.set(id, n.done ? previous : [...previous, id]);
  }
  const criticalPath = [...nodes.values()].filter(n => n.spec.releaseBlocking).map(n => chains.get(n.issue.number)).sort((a, b) => b.length - a.length)[0] ?? [];
  const conflicts = [];
  for (let a = 0; a < frontier.length; a++) for (let b = a + 1; b < frontier.length; b++) {
    if (nodes.get(frontier[a]).spec.owners.some(x => nodes.get(frontier[b]).spec.owners.some(y => x === y || x.startsWith(`${y}/`) || y.startsWith(`${x}/`)))) conflicts.push([frontier[a], frontier[b]]);
  }
  return { repo, parent, integration, nodes: [...nodes.values()], frontier, criticalPath, conflicts };
}

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('|', '&#124;').replaceAll('[', '&#91;').replaceAll(']', '&#93;').replaceAll('`', '&#96;').replace(/[\r\n]/g, ' ');
export function renderDelivery(model) {
  const lines = [
    '### Delivery view', '',
    `Integration: [#${model.integration.number}](${model.integration.html_url}) · ${model.integration.merged ? 'merged' : model.integration.draft ? 'draft' : model.integration.state}.`,
    '', 'This is a projection of GitHub metadata, not merge or release authorization.', '',
    '| Priority | Slice | Blockers | PR / integration | Release blocking | Outstanding conditions and human gates |',
    '|---|---|---|---|---|---|',
  ];
  for (const n of [...model.nodes].sort((a, b) => a.spec.priority - b.spec.priority || a.issue.number - b.issue.number)) {
    const pr = n.pull ? `[#${n.pull.number}](${n.pull.html_url}) ${n.pull.merged ? 'merged' : n.pull.draft ? 'draft' : n.pull.state}` : 'No PR';
    const conditions = [...n.spec.mergeConditions.map(c => `merge: ${c}`), ...n.spec.humanGates.map(g => `${g.phase}: ${g.question}`)];
    lines.push(`| ${n.spec.priority} | [#${n.issue.number}](${n.issue.html_url}) ${escape(n.issue.title)} | ${n.spec.blockedBy.map(id => `#${id}`).join(', ') || 'None'} | ${pr}; ${n.done ? 'complete' : escape(n.issue.state_reason ?? n.issue.state)} | ${n.spec.releaseBlocking ? 'Yes' : 'No'} | ${escape(conditions.join('; ') || 'None declared')} |`);
  }
  lines.push('', `Development frontier: ${model.frontier.map(id => `#${id}`).join(', ') || 'None'}.`,
    `Longest remaining dependency chain to release-blocking work: ${model.criticalPath.map(id => `#${id}`).join(' → ') || 'None'} (slice count, not a time estimate).`,
    `Declared ownership conflicts in that frontier: ${model.conflicts.map(pair => pair.map(id => `#${id}`).join(' / ')).join('; ') || 'None'}. Verify undeclared overlap before parallel work.`, '', '```mermaid', 'flowchart LR');
  for (const n of model.nodes) {
    lines.push(`  issue${n.issue.number}["#${n.issue.number}${n.done ? ' complete' : ''}"]`);
    for (const dep of n.spec.blockedBy) lines.push(`  issue${dep} --> issue${n.issue.number}`);
  }
  lines.push('```');
  return lines.join('\n');
}

// gh owns authentication. Arguments and JSON stdin avoid shell interpolation.
export function githubRequest(method, path, payload) {
  return new Promise((resolvePromise, reject) => {
    const args = ['api', '--hostname', 'github.com', '--method', method, path, '-H', 'Accept: application/vnd.github+json', '-H', 'X-GitHub-Api-Version: 2026-03-10'];
    if (payload) args.push('--input', '-');
    const child = spawn('gh', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '', errors = '';
    child.stdout.on('data', chunk => { output += chunk; if (output.length > 16 * 1024 * 1024) { child.kill(); reject(new Error('GitHub response too large')); } });
    child.stderr.on('data', chunk => { errors += chunk; });
    child.on('error', reject);
    child.stdin.on('error', reject);
    child.on('close', code => {
      if (code !== 0) return reject(new Error(`GitHub ${method} failed: ${errors}`));
      try { resolvePromise(JSON.parse(output)); } catch (error) { reject(error); }
    });
    child.stdin.end(payload ? JSON.stringify(payload) : undefined);
  });
}

export async function readDelivery(repo, parentNumber, request = githubRequest) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) || !positive(parentNumber)) throw new Error('Explicit repository and parent issue are required');
  const prefix = `repos/${repo}`;
  const parent = await request('GET', `${prefix}/issues/${parentNumber}`);
  issueIdentity(parent, parentNumber, repo);
  const spec = metadata(parent.body, 'delivery');
  if (!positive(spec.integrationPullRequest) || !list(spec.issues) || !spec.issues.length) throw new Error('Invalid parent delivery inventory');
  const integration = await request('GET', `${prefix}/pulls/${spec.integrationPullRequest}`);
  const issues = await Promise.all(spec.issues.map(id => request('GET', `${prefix}/issues/${id}`)));
  const ids = issues.map(issue => metadata(issue.body, 'slice').pullRequest).filter(id => id !== null);
  if (!ids.every(positive)) throw new Error('Invalid child PR identity');
  const pulls = await Promise.all([...new Set(ids)].map(id => request('GET', `${prefix}/pulls/${id}`)));
  return deliveryModel({ repo, parent, integration, issues, pulls });
}

export async function syncDelivery({ repo, parent, publish = false, request = githubRequest }) {
  const model = await readDelivery(repo, parent, request);
  const view = renderDelivery(model);
  const targets = [model.parent, model.integration].map(item => ({ number: item.number, before: item.body ?? '', after: replaceView(item.body, view) }));
  const updates = targets.filter(item => item.before !== item.after);
  if (!publish) return { mode: 'preview', view, updates };
  if (!updates.length) return { mode: 'published', updated: [] };
  // Recompute before any write. Changed source state requires a fresh preview.
  const fresh = await readDelivery(repo, parent, request);
  if (JSON.stringify(fresh) !== JSON.stringify(model)) throw new Error('Delivery source changed; preview again before publishing');
  const updated = [];
  try {
    for (const target of updates) {
      const path = `repos/${repo}/issues/${target.number}`;
      const current = await request('GET', path);
      if ((current.body ?? '') !== target.before) throw new Error(`Body #${target.number} changed; preview again`);
      await request('PATCH', path, { body: target.after });
      const saved = await request('GET', path);
      if (saved.body !== target.after) throw new Error(`Saved body #${target.number} did not match; inspect before retrying`);
      updated.push(target.number);
    }
  } catch (error) {
    throw new Error(`Delivery publication incomplete; verified updates: ${updated.join(', ') || 'none'}. The last attempted write may have applied. ${error.message}`);
  }
  return { mode: 'published', updated };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = {}, args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--publish' && !options.publish) options.publish = true;
      else if (['--repo', '--parent'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--')) {
        const key = args[i].slice(2);
        if (options[key]) throw new Error(`Repeated option ${args[i]}`);
        options[key] = args[++i];
      } else throw new Error('Usage: delivery.mjs --repo owner/repo --parent number [--publish]');
    }
    options.parent = Number(options.parent);
    console.log(JSON.stringify(await syncDelivery(options), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

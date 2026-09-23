import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  candidateState,
  loadIcmConfig,
  successfulReceipt,
  validateGateConfig,
} from './candidate-gate.mjs';

const exec = promisify(execFile);

async function editorialChanges(root, receipt, currentTree) {
  const git = async args => (await exec('git', args, { cwd: root, encoding: 'utf8' })).stdout.trim();
  if (!/^[0-9a-f]{40}$/.test(receipt.commit ?? '')) throw new Error('Receipt has no valid tested commit');
  if (await git(['rev-parse', `${receipt.commit}^{tree}`]) !== receipt.tree) throw new Error('Receipt commit and tree disagree');
  await git(['merge-base', '--is-ancestor', receipt.commit, 'HEAD']);
  const fields = (await git(['diff', '--raw', '--no-renames', '-z', receipt.tree, currentTree, '--'])).split('\0');
  const changes = [];
  for (let index = 0; index < fields.length && fields[index]; index += 2) {
    const [oldMode, newMode, , , status] = fields[index].slice(1).split(' ');
    const path = fields[index + 1];
    const permitted = path === 'README.md' || /^projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/PROJECT\.md$/.test(path ?? '');
    if (!permitted || status !== 'M' || oldMode !== '100644' || newMode !== '100644') {
      throw new Error(`Evidence reuse forbids change to ${path}`);
    }
    if (path !== 'README.md') {
      const before = await git(['show', `${receipt.tree}:${path}`]);
      const after = await git(['show', `${currentTree}:${path}`]);
      const frontmatter = body => body.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)?.[0];
      if (!frontmatter(before) || frontmatter(before) !== frontmatter(after)) {
        throw new Error(`Evidence reuse forbids changed Project metadata: ${path}`);
      }
    }
    changes.push(path);
  }
  return changes;
}

export async function verifyCandidateReceipt({ cwd = process.cwd(), evidenceTree } = {}) {
  const { config } = await loadIcmConfig(cwd);
  validateGateConfig(config.candidateGate);
  const state = await candidateState(cwd);
  if (state.status) throw new Error(`The candidate worktree is not clean:\n${state.status}`);
  const testedTree = evidenceTree ?? state.tree;
  if (!/^[0-9a-f]{40}$/.test(testedTree)) throw new Error('--evidence-tree requires a full Git tree SHA');
  const receiptPath = join(state.commonGitDir, 'icm-gate-receipts', `${testedTree}.json`);
  let receipt;
  try {
    receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') receipt = null;
    else throw error;
  }
  if (!successfulReceipt(receipt, testedTree, config.candidateGate)) {
    throw new Error(`Tree ${state.tree} has no successful configured candidate-gate receipt at ${receiptPath}`);
  }
  const reused = testedTree !== state.tree;
  const changes = reused ? await editorialChanges(state.worktree, receipt, state.tree) : [];
  return { commit: state.commit, receipt, receiptPath, tree: state.tree, testedTree, reused, changes };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--evidence-tree')) throw new Error('Usage: verify-candidate-receipt.mjs [--evidence-tree <tree-sha>]');
    const result = await verifyCandidateReceipt({ evidenceTree: args[1] });
    console.log(JSON.stringify(result, null, 2));
    if (result.reused) console.log('Reused evidence from testedTree; current tree did not run the full gate. Review changed decisions separately.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

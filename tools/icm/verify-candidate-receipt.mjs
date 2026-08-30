import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  candidateState,
  loadIcmConfig,
  successfulReceipt,
  validateGateConfig,
} from './candidate-gate.mjs';

export async function verifyCandidateReceipt({ cwd = process.cwd() } = {}) {
  const { config } = await loadIcmConfig(cwd);
  validateGateConfig(config.candidateGate);
  const state = await candidateState(cwd);
  if (state.status) throw new Error(`The candidate worktree is not clean:\n${state.status}`);
  const receiptPath = join(state.commonGitDir, 'icm-gate-receipts', `${state.tree}.json`);
  let receipt;
  try {
    receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') receipt = null;
    else throw error;
  }
  if (!successfulReceipt(receipt, state.tree, config.candidateGate)) {
    throw new Error(`Tree ${state.tree} has no successful configured candidate-gate receipt at ${receiptPath}`);
  }
  return { commit: state.commit, receipt, receiptPath, tree: state.tree };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const result = await verifyCandidateReceipt();
    console.log(`Candidate tree ${result.tree} has successful gate evidence: ${result.receiptPath}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

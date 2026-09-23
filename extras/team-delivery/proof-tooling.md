# Team proof tooling

Machine checks for repositories with CI and several contributors. The team
setup keeps this file; the solo setup removes it with the rest of the kit.

## Exact-candidate integration gate

A full gate is conditional on the accepted proof scope or an independently
required repository/release obligation. Focused proof with a scope reason is a
valid completion path when no full gate is required.

`icm.config.json` owns the optional candidate gate and its named command phases.
The source template leaves it disabled because it contains no application.
Before relying on it, configure the complete real phases and enable it.
A required full gate cannot be waived by leaving configuration disabled.

- Run `node extras/team-delivery/tools/candidate-gate.mjs` once after focused proof and review,
  from a committed, clean linked worktree.
- It rejects primary or dirty worktrees, concurrent runs, and duplicate success
  for the same Git tree; it records named terminal phase and runtime evidence
  under the common Git directory.
- Run `node extras/team-delivery/tools/verify-candidate-receipt.mjs` before relying on that receipt.
  It accepts only complete success for the current clean tree.
- To reuse evidence after editorial edits, run `node extras/team-delivery/tools/verify-candidate-receipt.mjs
  --evidence-tree <tested-tree-sha>`. The tested commit must be an ancestor.
- Only modifications of existing regular `README.md` and
  `projects/<slug>/PROJECT.md` files qualify; Project frontmatter must be unchanged.
  Additions, deletions, moves, mode changes, linked decision documents, workflow,
  configuration, operational instructions, and executable inputs require fresh proof.
- The verifier checks the path boundary, not whether meaning is editorial. Review
  the diff and changed decisions separately, and rerun affected ICM checks.
- Preserve the original receipt and tested tree. Report reuse explicitly; never
  claim the current tree ran the full gate. A failed receipt cannot be reused.
- Machine evidence cannot authorize merge, deployment, or a product decision.


## Changed-file ICM checks

Use `node tools/icm/workspace-check.mjs --changed-since <commit>` for bounded
Project prose changes. Selection includes committed, staged, unstaged, and
untracked non-ignored paths. The checker validates current files, affected
Projects, and incoming Markdown links transitively. It does not replace staged
revision comparison before relying on human review.

Shared, tooling, and unknown paths expand to the whole-workspace audit. A
removed Project is allowed only if remaining references and owners are valid.
This mode cannot be combined with Project or reviewed-commit selection.

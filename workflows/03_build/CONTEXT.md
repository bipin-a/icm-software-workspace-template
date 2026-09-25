---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Acceptance and proof, Links, Product behavior, Open questions]
---

# 03_build — Implement and publish the agreed change

One job: complete the accepted implementation and identify its exact candidate.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the brief sections named in frontmatter and relevant linked decision owners. Bounded work needs no Project.
- The branch, exact base, current diff, acceptance, affected application and test owners, and linked live delivery state.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Verify scope, base, branch, current changes, and authority. Preserve unrelated work and use the configured worktree dependency procedure when needed.
2. For several PRs, verify the accepted plan and integration ancestry. Reuse the Project branch and existing issues; create only missing authorized objects. Read them back and select an unblocked slice. A single PR skips this coordination.
3. Trace public behavior and canonical owners. Use existing proof where sufficient. When new behavioral proof is earned, show the intended failure, implement the smallest complete outcome, and make it pass. Regressions and high-risk changes require distinguishing failure-first proof; documentation and mechanical changes may mark behavioral testing N/A.
4. Run focused checks, inspect the full increment diff, and commit coherent work when delivery is in scope. Continue increments until the intended slice is complete.
5. Within publication authority, push and open or update the PR against the configured base or integration branch. Use the PR template to record exact revisions, proof, omissions, and remaining risks. Read back head, base, body, and checks.
6. Verify all required slices and merge conditions before relying on an assembled candidate. Child proof does not establish combined correctness. Refresh any configured delivery view from live metadata.
7. Pin candidate base and head on the PR, link it from a selected brief, and continue to Validate. A later change reopens affected proof, preserving unaffected evidence with its tested revision. Return material scope or design contradictions to their owner.

## Outputs

- PR: the completed change, exact candidate, focused evidence, omissions, and stable coordination links; brief Links points to it.

## Human check

Review scope, commits, proof, and omissions. Publication and passing checks do not authorize merge or deployment. Continue within existing authority.

## Rules

This table lists the rules this stage adds to the always-loaded set named in
`AGENTS.md` (voice, decision work, and principles); those still apply. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-RELEVANCE`; `RULE-WORKTREES`; `RULE-SOURCE`; `RULE-CALLER-MEANING`; `RULE-NO-INFERENCE`; `RULE-REPLACE-FIRST`; `RULE-NO-SCAFFOLD`; `RULE-REVIEWABLE-COMMITS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional when replacing behavior or protection: `RULE-REMOVE-LEGACY`; `RULE-MEANINGFUL-DELETION` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for data repair or migration: `RULE-CORRUPT-STATE`; `RULE-MIGRATION-OBJECT-PARITY` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for tests: `RULE-TEST-VALUE`; `RULE-DISCRIMINATING-TESTS`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | `Earn each test`; `Use the efficient proof sequence`; `Focused repository commands`; `Worktree dependency bootstrap` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for tests: `Prove the right cause at a stable boundary`; `Reuse test infrastructure without centralizing scenarios` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for browser proof: `Local browser-test safety` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for ICM document edits: `ICM artifact validation` |
| [`github-delivery-rules.md`](../../_shared/engineering/github-delivery-rules.md) | `Repository hygiene and branches`; `Commits`; `Pull requests are human review surfaces`; `Checks and delivery truth` |

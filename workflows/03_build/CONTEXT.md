---
type: workflow-stage
context:
  profile:
    path: workflows/03_build/CONTEXT.md
    heading: Rules
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Acceptance and proof, Links, Product behavior, Open questions]
  selectors:
    - path: _shared/engineering/multi-pr-delivery.md
      when: several PRs need coordinated delivery
  references:
    - path: _shared/engineering/github-delivery-rules.md
      headings: [Repository hygiene and branches, Commits, Pull requests are human review surfaces, Checks and delivery truth]
---

# 03_build — Implement and publish the agreed change

One job: complete the accepted implementation and identify its exact candidate.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the manifest's brief sections and relevant linked decision owners. Bounded work needs no Project.
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

Load only the named headings; conditional rows apply only when triggered. The
manifest lists brief inputs and additional stage references and selectors.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-RELEVANCE`; `RULE-ARCHITECTURE-DIRECTION`; `RULE-SOURCE`; `RULE-REPLACE-FIRST`; `RULE-WORKTREES`; `RULE-REVIEWABLE-COMMITS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional when replacing behavior or protection: `RULE-REMOVE-LEGACY`; `RULE-MEANINGFUL-DELETION` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for data repair or migration: `RULE-CORRUPT-STATE`; `RULE-MIGRATION-OBJECT-PARITY` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for tests: `RULE-TEST-VALUE`; `RULE-DISCRIMINATING-TESTS`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS` |
| [`document-review.md`](../../_shared/engineering/document-review.md) | `Review and change`; `Mechanical comparison` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | `Earn each test`; `Use the efficient proof sequence`; `Focused repository commands`; `Worktree dependency bootstrap` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for ICM edits: `ICM artifact validation` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for tests: `Prove the right cause at a stable boundary`; `Reuse test infrastructure without centralizing scenarios` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for browser proof: `Local browser-test safety` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional when full integration proof is required: `Exact-candidate integration gate` |
| [`github-delivery-rules.md`](../../_shared/engineering/github-delivery-rules.md) | Conditional for Git delivery: `Repository hygiene and branches`; `Commits`; `Pull requests are human review surfaces`; `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |
| [`review-rules.md`](../04_validate/references/review-rules.md) | Conditional for candidate or finding review: `Baseline review`; `Conditional angles`; `Finding format` |
| [`review-rules.md`](../04_validate/references/review-rules.md) | Conditional for ICM Markdown: `ICM Markdown review` |
| [`interface-evidence.md`](../01_understand/references/interface-evidence.md) | Conditional for product UI: `Interface ownership boundary`; `Required UI evidence`; `Evidence record` |
| [`release-rules.md`](../06_release/references/release-rules.md) | Conditional for deployment: `Authority and boundary`; `Plan before writes`; `Execute the authorized plan`; `Verify and decide` |

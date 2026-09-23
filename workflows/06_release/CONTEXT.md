---
type: workflow-stage
context:
  profile:
    path: workflows/06_release/CONTEXT.md
    heading: Rules
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Acceptance and proof, Links, Product behavior]
  references:
    - path: workflows/06_release/references/release-rules.md
      headings: [Authority and boundary, Plan before writes, Execute the authorized plan, Verify and decide]
---

# 06_release — Deploy and verify one environment at a time

One job: plan, execute, verify, and decide one authorized environment change. Skip when deployment is outside the requested outcome.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the manifest's brief sections and relevant linked decision owners. Bounded work needs no Project.
- The accepted candidate, configured provider procedure, selected target, existing plan and authority, and environment-specific migration, proof, recovery, and monitoring obligations. Never load credential values.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Prepare a concrete credential-free no-write plan using the configured provider procedure. Verify clean source, exact candidate and target, proposed writes, proof, recovery boundaries, and monitoring. This template supplies no deployment command, target, or mandatory environment sequence.
2. Reuse authority covering the exact plan; resolve missing material source, target, write, or recovery decisions before execution. Recheck source, target, scope, authority, and execution context immediately before writes.
3. Run the authorized procedure and record attempted, completed, failed, and partial actions with non-secret results. On failure, use only already authorized recovery or obtain the missing decision.
4. Verify actual deployed source, configuration, data, migration state, and every partial write. Reuse terminal smoke evidence for this attempt or run required checks, then prove accepted behavior using actual environment and reset constraints. Reachability alone does not prove persistence, migration, or isolation.
5. Record terminal results, production differences, failures, omissions, monitoring, and rollback limits. Decide: accept completion, plan the next environment, revise, retry, contain, roll back, or stop.
6. Continue only within the agreed environment sequence and authority. A material source, target, or write change returns to planning. Success in an earlier environment never authorizes production.

## Outputs

- PR/release surface: no-write plan and authority, deployment attempt, environment-specific proof, remaining obligations, and next route; brief Links points to them.

## Human check

Resolve missing authority for the plan, production, or a changed action. Reuse existing authority where it applies; no environment advances solely because checks passed.

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

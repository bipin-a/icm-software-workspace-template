---
type: workflow-stage
context:
  profile:
    path: workflows/01_understand/CONTEXT.md
    heading: Rules
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Product behavior, Acceptance and proof, Open questions]
  selectors:
    - path: _shared/domain/CONTEXT.md
      when: the outcome depends on existing domain definitions
    - path: workflows/01_understand/references/interface-evidence.md
      when: the outcome changes a product interface or customer-facing provider flow
---

# 01_understand — Understand the problem and desired outcome

One job: establish the intended behavior, scope, and observable acceptance.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this stage. Bounded work does not require a Project.
- The user request, current product behavior, and only the domain or interface owners needed to resolve this outcome.

Do not load unrelated Projects, other stages, or complete reference libraries.

## Process

1. Establish the user's job, desired outcome, fixed constraints, scope, and material unknowns. Distinguish a suggested solution from an explicit constraint. Carry forward accepted selections; investigate only missing or changed facts.
2. Inspect existing behavior and its owners, reading exact applicable domain definitions. For unresolved intent that changes a source of truth or has several defensible user-visible shapes, compare credible behaviors and sacrifices. Otherwise stay with the clear approach and explain that choice.
3. For a UI-affecting outcome, follow [Interface evidence](references/interface-evidence.md). Initiate a preview when it resolves uncertainty and reconcile what it teaches into the accepted behavior.
4. Define observable acceptance and the smallest sufficient proof. Keep decisions in chat/PR; use a living Project brief only when durable coordination needs it.
5. Use bounded technical inspection or [Design](../02_design/CONTEXT.md) when feasibility can change the product decision. Carry the evidence back to this decision owner.

## Outputs

- Accepted intent, behavior, scope, and acceptance in chat/PR or the living brief.
- Relevant interface evidence and explicit questions that still affect the result.

## Human check

Reuse existing authority for clear work. Resolve material product choices or missing authority before dependent implementation. Continue to Design or Build when the needed decisions are already settled.

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
| [`interface-evidence.md`](references/interface-evidence.md) | Conditional for product UI: `Interface ownership boundary`; `Required UI evidence`; `Evidence record` |
| [`release-rules.md`](../06_release/references/release-rules.md) | Conditional for deployment: `Authority and boundary`; `Plan before writes`; `Execute the authorized plan`; `Verify and decide` |

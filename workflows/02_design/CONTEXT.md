---
type: workflow-stage
context:
  profile:
    path: workflows/02_design/CONTEXT.md
    heading: Rules
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions, Intent]
  selectors:
    - path: _shared/domain/CONTEXT.md
      when: a technical choice depends on domain definitions or ownership
    - path: _templates/prototype-evidence.md
      when: an isolated experiment is needed to distinguish technical options
    - path: _templates/architecture-investigation.md
      when: material architecture uncertainty needs a bounded investigation
    - path: _templates/adr.md
      when: an accepted durable architecture decision needs a separate rationale
    - path: _shared/engineering/multi-pr-delivery.md
      when: dependencies, independent review boundaries, or release risk need several PRs to converge
---

# 02_design — Choose the simplest sufficient solution

One job: choose technical owners and a proportionate delivery shape. Skip when the approach is settled and has no material trade-off.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the manifest's brief sections and relevant linked decision owners. Bounded work needs no Project.
- The affected code, verified external facts, existing decisions, and material dependencies.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Pin accepted behavior and reuse root-cause and owner evidence. Inspect only changed code, stale facts, or unresolved questions; load exact applicable domain definitions.
2. Compare reuse with credible alternatives when consequences differ: effort, interfaces, migration, proof, operations, and uncertainty. Stop when more inspection would not change the choice. Apply the investigation limit before substantial work.
3. Record owners, invariants, proof, and relevant environment, migration, rollback, and monitoring obligations under Technical choices. An ADR or experiment must earn its place.
4. Keep one PR as the default. When several PRs are justified, define vertical outcomes, blockers, merge conditions, integration lifetime, combined proof, and human checkpoints under the multi-PR rules. Do not copy live status.
5. Complete coupled technical and delivery choices before presenting missing decisions together. Reuse authority; create dependent delivery objects only after the plan is agreed. Do not trade away accepted security, accessibility, integrity, or recovery obligations to reduce effort.
6. Return changed product behavior to Understand. Otherwise continue to Build within authority.

## Outputs

- Brief: Technical choices, or the same decisions in chat/PR; earned investigation or ADR links.

## Human check

Resolve missing authority for consequential technical and delivery choices together. Settled work needs no separate specification, Delivery Assessment, or intermediate approval.

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

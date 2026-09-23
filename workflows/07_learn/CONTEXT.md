---
type: workflow-stage
context:
  profile:
    path: workflows/07_learn/CONTEXT.md
    heading: Rules
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Technical choices, Acceptance and proof, Links]
  references:
    - path: workflows/07_learn/references/learning-rules.md
---

# 07_learn — Apply earned learning to the right owner

One job: correct the canonical source when evidence supports a useful lasting improvement.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this stage. Bounded work does not require a Project.
- The exact implementation, validation, release, or workflow evidence that revealed the lesson, and the one source that may need correction.

Do not load unrelated Projects, other stages, or complete reference libraries.

## Process

1. Use Learn only when meaningful evidence earns a correction. It may be entered from any stage; stabilize active harm before documenting a lesson.
2. Explain expected behavior, what occurred, why the existing control failed, recurrence credibility, limitations, and remaining risk.
3. Classify the cause as Project, Factory, Input contract, Execution, or External change. Choose the canonical owner using [Learning rules](references/learning-rules.md). A lesson is evidence, not another policy source.
4. Apply an accepted correction within scope. New lasting guidance or cross-Project principles need human review; keep the evidence in the existing PR unless a separate record earns its place.
5. Check that the corrected owner is reachable through the task's route under [Decision work](../../_shared/engineering/decision-work.md). Record applicability and limits; structural checks do not prove better agent behavior. Separately agree any substantial behavioral trial.
6. Revisit only decisions and proof affected by the correction, then continue the requested outcome. A successful stage alone does not require a lesson document.

## Outputs

- An evidence-backed correction to its canonical owner, or a reason no source should change, with the relevant evidence linked.

## Human check

Reuse authority for an accepted correction. Human review is required before promoting new lasting guidance; a one-off execution mistake does not justify another permanent rule.

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

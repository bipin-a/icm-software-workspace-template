---
type: workflow-stage
context:
  profile:
    path: workflows/05_assess-readiness/CONTEXT.md
    heading: Rules
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions, Intent, Links]
  references:
    - path: _shared/definition-of-done.md
      headings: [Finished Project workflow]
    - path: workflows/04_validate/references/review-rules.md
      headings: [Finding format]
    - path: _shared/engineering/github-delivery-rules.md
      headings: [Checks and delivery truth, Traceability and human gates, Merge methods preserve evidence and history]
---

# 05_assess-readiness — Decide findings and the next route

One job: resolve material findings and choose the next action for the exact candidate. Skip when no finding or route decision remains.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the manifest's brief sections and relevant linked decision owners. Bounded work needs no Project.
- The exact candidate, evidence, finding dispositions, requested completion boundary, and live merge preconditions when relevant.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Verify each finding can occur within supported behavior and applies to this candidate. Distinguish confirmed, uncertain, and invalid evidence.
2. Explain consequence, users, contract relationship, recovery, decision owner, credible responses, costs, and recommendation. Reuse applicable dispositions; otherwise select fix, investigate, change an accepted decision, revalidate, accept risk, defer, or dismiss with evidence.
3. Record human authority, mitigation, and revisit triggers for accepted material risk. Route product changes to Understand, technical/delivery changes to Design, code corrections to Build, and missing proof to Validate.
4. Apply the scoped definition of done. Required checks, open holds, and unresolved material choices remain blocking unless their owning authority changes the requirement.
5. Choose one route: correction, more proof, finish local work, merge when authorized, Release when requested, or stop. Before merge, verify current head, base, live policy, checks, reviews, and authority under GitHub delivery rules.
6. Record the decision and remaining obligations on chat/PR. Apply Learn only when an evidenced correction is earned. Non-deployment work finishes at its requested boundary.

## Outputs

- PR: applicable finding dispositions, accepted risks, and one next route for the exact candidate.

## Human check

Reuse existing decisions. Obtain missing authority for material risk or changed scope. Merge readiness does not authorize environment writes.

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

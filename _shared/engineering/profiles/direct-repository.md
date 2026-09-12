---
type: engineering-profile-library
status: active
---

# Engineering profile

## direct-repository

Use for bounded work with clear intent and known owners, and for selected
feature briefs. File count alone does not justify a Project. Keep work in chat
and the PR unless unresolved product, architecture, ownership, or work-order
decisions need durable coordination in one living brief.

| Source | Load only |
|---|---|
| [`safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-RELEVANCE`; `RULE-ARCHITECTURE-DIRECTION`; `RULE-SOURCE`; `RULE-REPLACE-FIRST`; `RULE-WORKTREES`; `RULE-REVIEWABLE-COMMITS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`safeguards.md`](../safeguards.md) | Conditional when replacing behavior or protection: `RULE-REMOVE-LEGACY`; `RULE-MEANINGFUL-DELETION` |
| [`safeguards.md`](../safeguards.md) | Conditional for data repair or migration: `RULE-CORRUPT-STATE`; `RULE-MIGRATION-OBJECT-PARITY` |
| [`safeguards.md`](../safeguards.md) | Conditional for tests: `RULE-TEST-VALUE`; `RULE-DISCRIMINATING-TESTS`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS` |
| [`document-review.md`](../document-review.md) | `Review and change`; `Mechanical comparison` |
| [`testing-rules.md`](../testing-rules.md) | `Earn each test`; `Use the efficient proof sequence`; `Focused repository commands`; `Worktree dependency bootstrap` |
| [`testing-rules.md`](../testing-rules.md) | Conditional for ICM edits: `ICM artifact validation` |
| [`testing-rules.md`](../testing-rules.md) | Conditional for tests: `Prove the right cause at a stable boundary`; `Reuse test infrastructure without centralizing scenarios` |
| [`testing-rules.md`](../testing-rules.md) | Conditional for browser proof: `Local browser-test safety` |
| [`testing-rules.md`](../testing-rules.md) | Conditional when full integration proof is required: `Exact-candidate integration gate` |
| [`github-delivery-rules.md`](../github-delivery-rules.md) | Conditional for Git delivery: `Repository hygiene and branches`; `Commits`; `Pull requests are human review surfaces`; `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |
| [`review-rules.md`](../../../workflows/feature/references/review-rules.md) | Conditional for candidate or finding review: `Baseline review`; `Conditional angles`; `Finding format` |
| [`review-rules.md`](../../../workflows/feature/references/review-rules.md) | Conditional for ICM Markdown: `ICM Markdown review` |
| [`interface-evidence.md`](../../../workflows/feature/references/interface-evidence.md) | Conditional for product UI: `Interface ownership boundary`; `Required UI evidence`; `Evidence record` |
| [`release-rules.md`](../../../workflows/feature/references/release-rules.md) | Conditional for deployment: `Authority and boundary`; `Plan before writes`; `Execute the authorized plan`; `Verify and decide` |

---
type: engineering-profile-library
status: active
---

# Direct repository and Understand profiles

## direct-repository

Use this profile only for a bounded repository change that has no selected
Project and does not need a Project workflow stage. If the work creates product
intent, changes a public contract, requires deployment or migration, or grows
beyond one reviewable change, create or select a Project and route by stage.

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-RELEVANCE`; `RULE-WORKTREES`; `RULE-REVIEWABLE-COMMITS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`../safeguards.md`](../safeguards.md) | Conditional when replacing or deleting a path, behavior, contract, or protection: `RULE-REMOVE-LEGACY`; `RULE-MEANINGFUL-DELETION` |
| [`../safeguards.md`](../safeguards.md) | Conditional when repairing contradictory persisted state: `RULE-CORRUPT-STATE` |
| [`../safeguards.md`](../safeguards.md) | Conditional when adding or changing tests: `RULE-TEST-VALUE` |
| [`../testing-rules.md`](../testing-rules.md) | `Use the efficient proof sequence`; `Repository entry commands` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when adding or changing shared test infrastructure: `Reuse test infrastructure without centralizing scenarios` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when selected proof uses a local browser: `Local browser-test safety` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Repository hygiene and branches`; `Commits` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | Conditional for GitHub pull-request work: `Pull requests are human review surfaces`; `GitHub command adapter`; `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |

## 01_understand

Understand selects no shared engineering references because root-cause
analysis, technical choices, and delivery structure belong to Design. Its
contract conditionally selects UI/UX principles, review rules, interface
evidence, and prototype evidence when the outcome affects a product interface.

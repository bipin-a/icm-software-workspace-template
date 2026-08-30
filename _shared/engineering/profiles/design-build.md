---
type: engineering-profile-library
status: active
---

# Design and Build profiles

## 02_design

The parent Design router selects no shared engineering references.

## 02_design-technical

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-RELEVANCE`; `RULE-ARCHITECTURE-DIRECTION`; `RULE-SOURCE`; `RULE-CALLER-MEANING`; `RULE-NO-INFERENCE`; `RULE-REPLACE-FIRST`; `RULE-CONTRADICTIONS`; `RULE-PUBLIC-CONTRACT` |
| [`../testing-rules.md`](../testing-rules.md) | `Earn each test`; `Prove the right cause at a stable boundary` |
| [`../python-tooling.md`](../python-tooling.md) | Conditional when Python is in scope: `Python tooling` |

## 02_design-delivery

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-ARCHITECTURE-DIRECTION`; `RULE-SOURCE`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Delivery profiles` |
| [`../multi-pr-delivery.md`](../multi-pr-delivery.md) | Conditional when `multi-pr` is credible: `Choose multi-PR delivery proportionately`; `Design vertical slices` |

## 03_build

The parent Build router selects no shared engineering references.

## 03_build-prepare

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-WHOLE-TRUTH`; `RULE-INTEGRATION-DELIVERY` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Repository configuration evidence`; `Repository hygiene and branches`; `Pull requests are human review surfaces`; `GitHub command adapter`; `Traceability and human gates` |
| [`../multi-pr-delivery.md`](../multi-pr-delivery.md) | Conditional for `multi-pr`: `Authority and delivery objects`; `Set up the delivery structure`; `Maintain the generated delivery view` |

## 03_build-increment

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-CALLER-MEANING`; `RULE-NO-INFERENCE`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS` |
| [`../testing-rules.md`](../testing-rules.md) | `Earn each test`; `Use the efficient proof sequence`; `Repository entry commands` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when adding or changing shared test infrastructure: `Reuse test infrastructure without centralizing scenarios` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when selected proof uses a local browser: `Local browser-test safety` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Commits` |
| [`../python-tooling.md`](../python-tooling.md) | Conditional when Python is in scope: `Python tooling` |

## 03_build-publish

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-NO-SCAFFOLD`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Pull requests are human review surfaces`; `GitHub command adapter`; `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |
| [`../multi-pr-delivery.md`](../multi-pr-delivery.md) | Conditional for `multi-pr`: `Maintain the generated delivery view`; `Work and merge the frontier` |

## 03_build-assemble

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH`; `RULE-INTEGRATION-DELIVERY` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Pull requests are human review surfaces`; `GitHub command adapter`; `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |
| [`../multi-pr-delivery.md`](../multi-pr-delivery.md) | Conditional for `multi-pr`: `Authority and delivery objects`; `Maintain the generated delivery view`; `Complete the Project delivery` |

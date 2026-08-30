---
type: engineering-profile-library
status: active
---

# Validate and Assess Readiness profiles

## 04_validate

The parent Validate router selects no shared engineering references.

## 04_validate-review

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PUBLIC-CONTRACT`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Pull requests are human review surfaces`; `GitHub command adapter`; `Checks and delivery truth`; `Traceability and human gates` |

## 04_validate-criterion

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-DISCRIMINATING-TESTS`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS`; `RULE-WHOLE-TRUTH` |
| [`../testing-rules.md`](../testing-rules.md) | `Earn each test`; `Use the efficient proof sequence`; `Repository entry commands` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional for lifecycle behavior: `Consider lifecycle states only when relevant` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when adding or changing shared test infrastructure: `Reuse test infrastructure without centralizing scenarios` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when selected proof uses a local browser: `Local browser-test safety` |

## 04_validate-gate

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH`; `RULE-CONSEQUENCE-TESTS` |
| [`../testing-rules.md`](../testing-rules.md) | `Exact-candidate integration gate` |

## 04_validate-complete

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `GitHub command adapter`; `Checks and delivery truth`; `Traceability and human gates` |

## 05_assess-readiness

The parent Assess Readiness router selects no shared engineering references.

## 05_readiness-finding

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-CONTRADICTIONS`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Pull requests are human review surfaces`; `Traceability and human gates` |

## 05_readiness-route

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `GitHub command adapter`; `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |

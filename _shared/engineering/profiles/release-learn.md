---
type: engineering-profile-library
status: active
---

# Release and Learn profiles

## 06_release

The parent Release router selects no shared engineering references.

## 06_release-plan

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-SOURCE`; `RULE-NO-INFERENCE`; `RULE-MIGRATION-OBJECT-PARITY`; `RULE-DEPLOYMENT-CONFIG`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Repository configuration evidence`; `Traceability and human gates` |

## 06_release-deploy

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-MIGRATION-OBJECT-PARITY`; `RULE-DEPLOYMENT-CONFIG`; `RULE-WHOLE-TRUTH` |

## 06_release-verify

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-SOURCE`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS`; `RULE-WHOLE-TRUTH` |
| [`../testing-rules.md`](../testing-rules.md) | `Use the efficient proof sequence`; `Progress evidence through environments`; `Repository entry commands` |
| [`../testing-rules.md`](../testing-rules.md) | Conditional when selected proof uses a local browser: `Local browser-test safety` |

## 06_release-decide

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-CONTRADICTIONS`; `RULE-WHOLE-TRUTH` |
| [`../github-delivery-rules.md`](../github-delivery-rules.md) | `Checks and delivery truth`; `Traceability and human gates` |

## 07_learn

| Source | Load only |
|---|---|
| [`../safeguards.md`](../safeguards.md) | `RULE-PLAIN-DECISIONS`; `RULE-RELEVANCE`; `RULE-SOURCE`; `RULE-REPLACE-FIRST`; `RULE-CONTRADICTIONS`; `RULE-WHOLE-TRUTH` |

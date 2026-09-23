# Team delivery rules

Each section adds rows to the Rules table of the stage it names. A stage loads
its own table and, when this kit is present, its section here. A heading must
not appear both here and in the stage's own table.

## 02_design

| Source | Load only |
|---|---|
| [`multi-pr-delivery.md`](multi-pr-delivery.md) | Conditional when dependencies, review boundaries, or release risk need several PRs: `Choose and prepare` |

## 03_build

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for several PRs: `RULE-INTEGRATION-DELIVERY` |
| [`multi-pr-delivery.md`](multi-pr-delivery.md) | Conditional for several PRs: `Coordinate` |
| [`delivery-views.md`](delivery-views.md) | Conditional when a delivery view is configured: whole file |

## 04_validate

| Source | Load only |
|---|---|
| [`proof-tooling.md`](proof-tooling.md) | `Exact-candidate integration gate` |

## direct-repository

| Source | Load only |
|---|---|
| [`proof-tooling.md`](proof-tooling.md) | Conditional when full integration proof is required: `Exact-candidate integration gate` |
| [`proof-tooling.md`](proof-tooling.md) | Conditional for bounded Project prose changes: `Changed-file ICM checks` |
| [`release-rules.md`](../../workflows/06_release/references/release-rules.md) | Conditional for deployment: `Authority and boundary`; `Plan before writes`; `Execute the authorized plan`; `Verify and decide` |

---
type: delivery-assessment
project:
status: proposed
product_specification:
technical_specification:
---

# Delivery Assessment

Use this assessment to choose a proportionate delivery shape before Build. It
does not mirror live GitHub progress or expand scope for theoretical risks.

## Intended outcome


## Investment decision

- Evidence for expected value:
- Important assumptions:
- Why now:
- Accepted appetite:
- Consequence of delay:
- Next-best use of the effort:
- Is the Project worth doing at the assessed cost?:

## Delivery proportionality

Rate each dimension relative to this repository and explain the consequence for
delivery. Do not treat a larger document or ticket count as safer by default.

| Dimension | Assessment | Evidence | Delivery consequence |
|---|---|---|---|
| Relative size |  |  |  |
| Consequence risk |  |  |  |
| Fragility |  |  |  |
| Affected surfaces |  |  |  |
| Validation burden |  |  |  |
| Uncertainty |  |  |  |

## Selected design and delivery consequences

- Selected option reference: exact Technical Specification revision and option
  row
- Decision evidence or prototype:
- Material difference discovered during exact delivery planning:

The Technical Specification owns solution alternatives. This assessment owns
the exact delivery plan for the selected option. Return to technical design if
the exact plan materially changes the option's cost, risk, or architecture.

## Delivery shapes considered

Compare only credible delivery shapes for the selected technical option.
Include the smaller reversible shape when it could satisfy the outcome, and a
larger shape only when its extra cost buys a named benefit.

| Option | What it preserves | What it removes or delays | Cost | Risk | Uncertainty |
|---|---|---|---|---|---|
| Recommended shape |  |  |  |  |  |
| Smaller shape |  |  |  |  |  |
| Other credible option |  |  |  |  |  |

## Delivery profile

Apply the selected shared delivery-profile rule and, when applicable, the
multi-PR rules. Record the resulting profile and reason without restating those
rules here.

- Recommended profile: single-pr / multi-pr
- Reason:
- Integration-branch lifetime, when applicable:

## Proposed delivery slices

For `single-pr`, one outcome row is sufficient. For `multi-pr`, use narrow
vertical slices. Keep estimated size, consequence risk, uncertainty,
development priority, blockers, merge conditions, and release relevance
distinct.

| Slice | Observable outcome | Product criteria | Size | Risk | Uncertainty | Priority | Blockers or merge conditions | Release relevance | Required proof |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |

## Architecture dependencies and human checkpoints

| Decision, investigation, or checkpoint | Why it is needed | Affected work | Owner | Required before |
|---|---|---|---|---|
|  |  |  |  |  |

## Future-readiness decisions

Record only credible future pressure on a hard-to-change boundary. `No added
seam` is a valid decision when the pressure or cost is not demonstrated.

| Future pressure | Hard-to-change boundary | Cheapest justified seam now | Cost if omitted | Decision |
|---|---|---|---|---|
|  |  |  |  |  |

## Final proof and release shape

- Exact combined behavior to prove:
- Environments and data required:
- Operational, migration, rollback, or monitoring proof:
- Human release gates:

## Recommendation

- Recommended option:
- Recommended delivery profile:
- Important trade-offs:
- Accepted omissions:

## Human decision

- Decision:
- Accepted scope:
- Accepted omissions:
- Specification changes required:
- Approved by:
- Date:

---
type: roadmap-contract
status: active
---

# Roadmap

One job: hold future product directions that may influence current decisions but are not ready to become Projects or specifications.

## Inputs

- New product directions
- Relevant Project discoveries and accepted lessons
- Human changes to priority, confidence, or timing

## Process

1. Add or update one row in `future-features.md`.
2. Keep the row directional: describe the intention and likely architectural pressure, not a complete solution.
3. Link an exact related Project record when one exists.
4. When the direction becomes actionable, create a Project through
   [`../projects/CONTEXT.md`](../projects/CONTEXT.md), mark the row `Promoted`,
   and link that record.

## Output

- `future-features.md`

## Rules

- This is not a specification, priority system, shipped-feature list, or
  historical delivery log.
- Detailed behaviour and implementation decisions belong in Project decisions.
- Do not treat a future direction as a current requirement unless an approved Project adopts it.
- Read changing issue, delivery, and release state from its owning external
  system; do not copy it into a roadmap row.
- One row owns each direction; link instead of copying it elsewhere.

## Human check

Confirm that each direction is useful, appropriately uncertain, and assigned the correct status.

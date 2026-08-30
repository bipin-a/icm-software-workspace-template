---
type: workflow-router
---

# 05_assess-readiness — route finding disposition and candidate decision

One job: route one human readiness action for the exact validated candidate.
This parent does not dispose a finding, accept risk, merge, or authorize an
environment promotion.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Live working input: exact candidate identity, terminal validation evidence,
  material findings, and existing disposition links
- Working: approved Delivery Assessment `Human decision`
- Capability routing: `../CONTEXT.md`

Do not load specifications, code, complete diffs or logs, engineering
references, another stage, or prior Project runs while routing.

## Routes

1. Verify the candidate and validation evidence identify the same exact head.
2. For each material finding without an approved disposition, enter
   [`01_dispose-finding/`](01_dispose-finding/CONTEXT.md) in a fresh context.
3. When no complete validation handoff exists yet, route an approved finding
   disposition back to Validate. Do not infer final readiness from partial
   evidence.
4. After every material finding has a disposition and validation has a complete
   exact-candidate handoff, enter
   [`02_choose-route/`](02_choose-route/CONTEXT.md).
5. A changed candidate returns to Validate. A correction, specification change,
   delivery reassessment, or architecture investigation returns to its
   canonical owner.

---
type: workflow-router
---

# 04_validate — route exact-candidate evidence work

One job: route one validation action for the exact candidate. This parent does
not review code, run proof, dispose findings, or approve readiness.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Live working input: exact candidate pull request or commit admitted by Build
- Working: approved Delivery Assessment `Human decision`
- Capability routing: `../CONTEXT.md`

Do not load specifications, candidate code or diff, test logs, engineering
references, another stage, or prior Project runs while routing.

## Routes

1. Verify the candidate identity and approved artifacts named by the Project.
2. When baseline candidate review is absent or invalidated, enter
   [`01_review-candidate/`](01_review-candidate/CONTEXT.md).
3. When review has a material finding without an approved disposition that
   permits this exact candidate to continue unchanged, enter Assess Readiness
   before running more proof.
4. For each accepted Product criterion without terminal evidence on this
   candidate, enter
   [`02_validate-criterion/`](02_validate-criterion/CONTEXT.md) in a fresh
   context.
5. Route any new material failure or finding through Assess Readiness before
   the full gate unless its approved disposition permits this candidate
   unchanged.
6. When review and every required criterion result are terminal, enter
   [`03_verify-candidate-gate/`](03_verify-candidate-gate/CONTEXT.md).
7. When the exact-candidate gate result is terminal, enter
   [`04_complete-validation/`](04_complete-validation/CONTEXT.md).
8. A changed candidate returns to Build assembly; a specification or assessment
   contradiction returns to its canonical owner.

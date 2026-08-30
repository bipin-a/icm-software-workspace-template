---
type: workflow-router
---

# 03_build — route approved delivery work

One job: route one approved Build action in a fresh context. This parent does
not prepare delivery objects, implement code, publish a slice, or assemble the
Project candidate itself.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/delivery-assessment.md`
  - Read only `Delivery profile`, `Architecture dependencies and human
    checkpoints`, and `Human decision` to confirm approval, selected profile,
    and required decisions.
- Conditional: when the assessment requires an Architecture Investigation,
  read only its `Human decision and routing` through the Project link.
- Live external state: follow only the delivery links in the selected Project.
- Capability routing: `../CONTEXT.md`

Do not load specifications, issue bodies, implementation files, another
stage's references, or the complete engineering library while routing.

## Routes

1. Verify that the exact Delivery Assessment is approved and that no unresolved
   investigation or human decision blocks the selected work.
2. For multi-pull-request delivery, if the approved issue and branch topology
   is absent, enter [`01_prepare-delivery/`](01_prepare-delivery/CONTEXT.md). A
   single-pull-request profile skips that step and targets the configured base
   branch directly.
3. Select exactly one unblocked delivery slice from live state. While an
   accepted criterion remains unimplemented, enter
   [`02_implement-increment/`](02_implement-increment/CONTEXT.md) for one
   proof-driven increment.
4. When that slice's implementation branch satisfies its accepted criteria,
   enter [`03_publish-slice/`](03_publish-slice/CONTEXT.md) to create or update
   its exact pull request.
5. For multi-pull-request delivery, repeat steps 3–4 as the frontier advances.
   Once all required slices are assembled—or once a single-pull-request
   candidate is complete—enter
   [`04_assemble-candidate/`](04_assemble-candidate/CONTEXT.md) to pin the exact
   candidate and route it to Validate.
6. Route backward to Design when requested behavior lacks a specification
   owner, implementation contradicts an accepted artifact, the live delivery
   shape contradicts the assessment, or material uncertainty blocks a boundary.
   Do not work around the contradiction or add a speculative abstraction.

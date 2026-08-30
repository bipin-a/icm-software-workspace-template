---
type: workflow-router
---

# 02_design — route solution and delivery decisions

One job: route an approved Product Specification through two bounded, coupled
design decisions. Each technical option carries its likely delivery
consequences before selection; the selected option then receives an exact
delivery plan. This stage does not change product intent, create live delivery
objects, or implement code.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/specs/product-spec.md`
- Conditional working metadata, when present:
  `../../projects/<project-slug>/specs/technical-spec.md`
- Conditional working metadata, when present:
  `../../projects/<project-slug>/delivery-assessment.md`

Read only artifact existence, frontmatter status, and exact approved revisions
while selecting the next step. Do not load artifact bodies in this router.

## Routes

1. If the Technical Specification has `status: product-feedback`, return its
   exact Product Specification revision and evidence to Understand.
2. If the Product Specification is absent, draft, rejected, or invalidated
   other than `feasibility-requested`, return to Understand.
3. If the Product Specification has `status: feasibility-requested`, or if its
   Technical Specification or option-level delivery estimate is absent, draft,
   rejected, or invalidated, follow
   [`01_choose-technical-design/CONTEXT.md`](01_choose-technical-design/CONTEXT.md)
   in a fresh context. For feasibility, assess only the exact option IDs.
4. If the Technical Specification is approved and the Delivery Assessment is
   absent, proposed, rejected, or invalidated, follow
   [`02_choose-delivery-shape/CONTEXT.md`](02_choose-delivery-shape/CONTEXT.md)
   in a fresh context.
5. When all three artifacts are approved at exact mutually applicable
   revisions, route to Build.

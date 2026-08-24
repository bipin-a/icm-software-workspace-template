# 02_assess-delivery — compare delivery trade-offs

One job: determine whether the selected Project is worth doing at its understood cost and choose the simplest justified delivery shape before implementation begins.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/specs/product-spec.md`
- Working: `../../projects/<project-slug>/specs/technical-spec.md`
- Working when relevant: prototype findings under `../../projects/<project-slug>/prototypes/`
- Working when relevant: accepted ADRs and architecture-spike decisions linked by the Project
- Working when relevant: related rows in `../../roadmap/future-features.md`
- Reference: `references/delivery-assessment-rules.md`
- Reference when relevant: `../../_shared/principles/product-principles.md`
- Reference when relevant: `../../_shared/principles/engineering-principles.md`
- Reference: `../../_shared/engineering/github-delivery-rules.md`
- Template: `../../_templates/delivery-assessment.md`

Do not create branches, issues, or pull requests during assessment.

## Process

1. Confirm the Product and Technical Specifications are approved and aligned and no applicable architecture hold remains unresolved.
2. Restate the Project intention, supporting evidence, assumptions, and why it matters independently of the proposed implementation.
3. Draft the smallest coherent vertical slices that produce a useful outcome or decision-changing evidence.
4. Assess each slice's size, risk, uncertainty, dependencies, and required proof.
5. Compare the expected value, appetite, cost of delay, and next-best use of the effort against the now-visible delivery cost.
6. Decide which plausible future pressures justify a cheap extension seam now and which flexibility should be deferred.
7. Generate a Mermaid dependency diagram from the slice table.
8. Compare full, simplified, phased or POC, prototype-first, and defer or reject options.
9. Recommend whether to proceed and, if so, a delivery shape and `single-pr` or `multi-pr` profile.

## Outputs

- `../../projects/<project-slug>/delivery-assessment.md`
- After human approval: the selected `delivery_profile` and assessment link in `../../projects/<project-slug>/PROJECT.md`

## Human check

Choose whether the Project is worth doing at the assessed cost, then build as specified, simplify, split into phases or POCs, prototype first, return to Spec & Design, defer, or reject. If the choice changes product behaviour or scope, update the specifications through Spec & Design and reassess before Build.

## Skill routing

- Use `planning-and-task-breakdown` to form reviewable vertical slices.
- Use `doubt-driven-development` for consequential architecture or trade-off claims.
- Use `prototype` when uncertainty is too high to estimate responsibly.

Invoke a skill only when its condition is present. Assessment owns delivery shape and trade-offs, not intended behaviour.

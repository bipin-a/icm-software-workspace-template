# 01_spec-design — define an aligned specification

One job: produce one current Product Specification and one aligned Technical Specification for the selected Project.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: existing files under `../../projects/<project-slug>/specs/`, if present
- Working when relevant: related rows in `../../roadmap/future-features.md`
- Reference: `references/specification-rules.md`
- Reference when relevant: `../../_shared/principles/product-principles.md`
- Reference when relevant: `../../_shared/principles/ux-principles.md`
- Reference when relevant: `../../_shared/ux/ui-ux-rules.md`
- Reference when relevant: `../../_shared/principles/engineering-principles.md`
- Reference when Python is in scope: `../../_shared/engineering/python-tooling.md`
- Reference when a consequential architecture decision is present: `../../_shared/architecture/decision-rules.md`
- Working when relevant: accepted ADRs and architecture-spike findings linked by the Project
- Template: `../../_templates/specification/`

Do not load unrelated Projects in full or every principle file by default. Search first, then open only likely overlaps and relevant principles.

## Process

1. Check for an existing or overlapping Project and specification.
2. Draft or reconcile the product intention, supporting evidence, assumptions, flows, states, and Product Specification.
3. For human-facing behaviour, establish and review interface evidence before committing new backend boundaries, following `references/specification-rules.md`. Use the least expensive faithful surface: prefer an existing frontend when suitable; otherwise begin with an ASCII flow and add an isolated interactive frontend only when needed.
4. Record the applicability decision, evidence, and findings, then reconcile them into the Product and Technical Specifications. Prototype code is not authoritative production code, including when it was written inside the existing application.
5. Discuss and draft the domain model, ownership, boundaries, persistence, environment and test-data strategy, technology, and third-party choices with the human.
6. If a consequential architecture decision lacks sufficient evidence, set an architecture hold and route to the architecture-spike workflow.
7. Search the roadmap for plausible pressure on hard-to-change boundaries.
8. Draft or reconcile the Technical Specification, including accepted extension seams and deliberately deferred flexibility.
9. Record consequential rationale in an ADR when earned.
10. Iterate between both specifications when feasibility changes the user flow, then check that they agree.

## Outputs

- `../../projects/<project-slug>/specs/product-spec.md`
- `../../projects/<project-slug>/specs/technical-spec.md`
- Optional prototype evidence under `../../projects/<project-slug>/prototypes/`
- Optional Project-local decisions under `../../projects/<project-slug>/decisions/`

Prototype folders use `prototypes/<concept>/prototype-brief.md`, optional `ascii-wireframe.md`, optional isolated `frontend/`, and `findings.md`. When the experiment changes an existing frontend, keep its durable evidence in the prototype folder and record the temporary code location in the brief.

## Skill routing

- Use `grill-with-docs` when material decisions or terms remain unresolved.
- Use `prototype` when interaction or feasibility uncertainty needs evidence.
- Use `frontend-design` for significant UI/UX framing.
- Use `domain-modeling` when domain concepts, invariants, or ownership are unclear.
- Use `api-and-interface-design` for consequential interfaces or module boundaries.
- Use `source-driven-development` when selecting or depending on third-party technology.
- Use `documentation-and-adrs` when a material architecture decision is accepted.

Invoke a skill only when its condition is present. Its output must still be reconciled into the canonical Project artifacts.

## Human check

Read both specifications. For human-facing behaviour, review the interface evidence or the recorded reason existing evidence is sufficient. Explicitly review the data model, boundaries, third parties, relevant ADRs, and unresolved architecture holds. Edit the specifications directly and mark them approved only when the intended product and technical approach agree, then continue to Assess Delivery.

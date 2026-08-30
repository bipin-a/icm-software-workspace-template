---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: 01_understand
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Desired outcome, Scope, Non-goals, Completion, Canonical artifacts]
  references:
    - path: workflows/01_understand/references/interface-evidence.md
  selectors:
    - path: roadmap/future-features.md
      when: accepted future pressure may constrain the outcome
    - path: _shared/principles/product-principles.md
      when: an earned cross-Project product principle applies
    - path: _shared/principles/ux-principles.md
      when: the accepted outcome affects a user interface or interaction
    - path: _shared/ux/ui-ux-rules.md
      when: the accepted outcome affects a user interface or interaction
    - path: _templates/prototype-evidence.md
      when: interface or product evidence needs a separate frame findings record or disposition
  output_templates:
    - path: _templates/specification/product-spec.md
    - path: _templates/approval-receipt.md
---

# 01_understand — approve the problem and desired outcome

One job: define and approve the intended product outcome in one Product
Specification. Do not investigate non-UI implementation, compare technical
solutions, or choose delivery structure.

## Inputs

- Repository inputs and outputs are declared by `context` above.
- Conditional repository inputs are declared by `context.selectors` above.

Load a principle or UX file only when the accepted outcome triggers it. Inspect
only the applicable interface surface and owner. For a provider-owned customer
interface, inspect its real boundary and the product's launch and return
surfaces. Do not load downstream delivery records, non-UI implementation,
engineering libraries, or unrelated Projects.

## Process

1. Confirm the user, problem, outcome, scope, non-goals, evidence, and material
   assumptions using the repository's canonical domain language when it exists.
2. Ask one trigger question: does the outcome create or change a source of
   truth, or is there more than one defensible user-visible shape? When true,
   compare two or three credible product behaviors, benefits, and sacrifices.
   Otherwise stay single-track and do not invent alternatives.
3. Let the human select one behavior or set `status: feasibility-requested`.
   That status sends only the exact option set to Design; it is not approval.
4. Decide whether the accepted outcome changes the product's UI, crosses a
   provider-owned customer interface, or has no product UI. Follow
   `references/interface-evidence.md` for the applicable interface case and
   apply the routed UX principles and review questions; otherwise record why
   interface evidence is not applicable.
5. Reconcile evidence into the flow, reachable states, accepted sacrifice, and
   observable acceptance criteria. Keep only states or exclusions that
   distinguish the outcome.
6. Record contradictions, missing authority, and the exact reviewed Product
   Specification revision.

## Outputs

- `../../projects/<project-slug>/specs/product-spec.md`
- After approval, its receipt under
  `../../projects/<project-slug>/approvals/`
- Conditional interface and Prototype Evidence linked from the specification

## Human check

Approve the problem, chosen behavior and sacrifice, scope, criteria, exact
Product Specification revision, assumptions, and questions—or request
feasibility. For a UI-affecting Project, also approve the proposed interface
evidence and relevant states. Approval admits the selected behavior to Design.
Feasibility admits only engineering feedback; rejection or changed intent
stays in Understand.

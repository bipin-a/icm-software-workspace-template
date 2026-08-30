# Interface evidence

Use this reference whenever the accepted outcome changes a user-facing
interface, interaction, or visual state. Interface evidence is mandatory for
that Project; a non-UI Project records why it is not applicable.

## Interface ownership boundary

- **The product's UI:** inspect the owning application surface and create the
  updated mockup or isolated prototype described below.
- **Provider UI in the customer flow:** model the product's launch or handoff
  and its return, cancellation, denial, timeout, and error states. Use
  inspectable evidence from the real provider interface when needed; do not
  recreate or redesign UI that the provider owns.
- **Operator console or API-only boundary:** product interface evidence is not
  applicable unless the product's own operator or customer interface changes.
  Design owns the technical contract; Release owns any authorized procedure.

## Required UI evidence

1. Inspect the exact current interface, its owning code or components, styles,
   design system, and relevant states. Reuse the application shell, routes,
   components, and safe existing services when that is the least expensive
   faithful surface.
2. For changed product UI, create an inspectable proposed mockup or isolated
   interactive prototype. For provider-owned UI, use the real interface as
   evidence and prototype only the surrounding launch, return, and result
   states. Use lower fidelity only when it answers the product question
   faithfully, and record why.
3. Apply the routed UI/UX principles and review rules. Every control must serve
   a user goal or necessary decision; important state, consent, and control
   stay visible; the next action must be clear or its absence explained; and
   the flow must not manipulate the user.
4. Show only states the accepted behavior can reach, including the relevant
   initial, action, loading, empty, result, error, disabled, reversal, and
   responsive states.
5. Use realistic safe data. Mocks and fixtures are appropriate when they answer
   the question without distorting behavior. Do not build a new backend merely
   to make a prototype appear complete.
6. Isolate prototype changes through a temporary branch or worktree, local-only
   route, feature flag, or equivalent reversible boundary. Prototype code is
   not production code.

## Evidence record

The Product Specification links the current surface, exact proposed artifact,
reused owners, states shown, material UX answers, product decisions learned,
and changes reconciled into acceptance. When a separate experiment needs
framing or disposition, use `_templates/prototype-evidence.md` and link it from
the Project.

## Not applicable

Record `no product UI` only when the accepted outcome changes neither the
product's UI nor a provider interface in the customer flow. Internal effort, a
familiar pattern, or an API implementation is not a reason to skip evidence for
a UI-affecting change.

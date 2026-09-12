# Interface evidence

Use this reference whenever the accepted outcome changes a user-facing
interface, interaction, or visual state. Interface evidence is mandatory for
that task; non-UI work may record why it is not applicable.

## Interface ownership boundary

- **Our product UI:** inspect the owning application surface and create the
  updated mockup or isolated prototype described below.
- **Provider UI in the customer flow:** model our launch or handoff and our
  return, cancellation, denial, timeout, and error states. Use inspectable
  evidence from the real provider interface when needed; do not recreate or
  redesign UI that the provider owns.
- **Operator console or API-only boundary:** product interface evidence is not
  applicable unless our own application interface also changes. Preserve the
  technical contract and any authorized operator procedure.

## Required UI evidence

1. For our product UI, inspect the exact current interface and its owning
   application code, components, styles, and relevant states. For a
   provider-owned customer interface, inspect the real boundary and our owning
   launch and return surfaces.
2. For our changed UI, create an inspectable proposed mockup or isolated
   interactive prototype from existing code and components. For provider-owned
   UI, use the real interface as evidence and mock or prototype only our
   surrounding launch, return, and result states. Use lower fidelity only when
   it answers the product question faithfully, and record why. Initiate the
   preview when it can resolve interaction uncertainty; do not wait for the
   user to ask. For a trivial correction, inspecting the changed real interface
   supplies the evidence without a separate prototype.
3. Show the states that distinguish the accepted behavior, including the
   relevant initial, action, result, empty, error, disabled, or responsive state.
   Do not enumerate states the product cannot reach.
4. Use realistic safe data. A prototype may use fixtures, but it must not create
   a second production data path or imply that integration is complete.
5. Keep prototype code isolated. Production implementation belongs to Build;
   promotion requires the applicable accepted technical decisions and normal
   proof under the selected workflow; a separate specification is not required
   by `feature-work`.

## Evidence record

- The chat/PR or selected Project brief links the current surface, exact proposed artifact, reused
  UI owners, states shown, product decisions learned, and changes reconciled into
  acceptance.
- When a separate experiment needs framing or a disposition, use
  `_templates/prototype-evidence.md` and link it from the Project.

## Not applicable

- Record `no product UI` only when the accepted outcome changes neither our UI nor a
  provider interface in the customer flow.
- An operator console or API-only boundary may use this disposition while retaining its
  technical and release requirements.
- Internal effort or a familiar existing pattern is not a reason to skip evidence for a
  UI-affecting change.

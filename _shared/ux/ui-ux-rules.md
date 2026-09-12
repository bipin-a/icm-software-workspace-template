# UI/UX review rules

Use this rubric when drafting or reviewing a Project brief, interface
evidence, prototype, or UI-affecting candidate. It evaluates the experience; a
workflow contract owns the required artifact and approval procedure.

## User goal and control

- What user goal or necessary decision does each control serve?
- Does the control deserve its space, or is there a simpler flow that preserves
  important state, consent, and control?
- What friction, confusion, or behaviour could this design create?
- What behaviour does the product encourage, and does that behaviour support the user's intended outcome?

## Reachable states

- Which initial, action, result, empty, loading, error, disabled, responsive,
  return, cancellation, denial, or timeout states can the accepted behavior
  actually reach?
- In each relevant state, is the next action clear, or is the reason no action
  is available explained?
- Can ambiguity be reduced with a useful default, example, constraint, or
  progressive disclosure without hiding material consequences?

Do not enumerate states that the product and its real boundaries cannot reach.

## Interface ownership and evidence

- Is the proposal grounded in the exact current interface, its owning code or
  components, and its established visual and interaction language?
- Which existing interface owners are reused, and what new owner is justified?
- When a provider owns part of the customer flow, does the evidence cover our
  launch, handoff, return, cancellation, denial, timeout, and error surfaces
  without recreating the provider's interface?
- Does the evidence use realistic safe data and state what differs from
  production?
- Does a prototype answer the named question without implying that its code,
  data path, or integration is production-ready?

## Accessibility and ethical behavior

- Can the relevant interaction be perceived, understood, and operated with the
  applicable keyboard, focus, contrast, motion, and assistive-technology needs?
- Do validation and feedback help the user recover without hiding state or
  blame?
- Does the design avoid coercion, deceptive defaults, artificial urgency, and
  other dark patterns?

Record material product decisions in the Project brief and material
evidence in the workflow's owning artifact. This rubric is reusable guidance,
not a substitute for Project-specific intent or real-browser proof.

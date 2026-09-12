---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Product behavior, Acceptance and proof, Open questions]
  selectors:
    - path: workflows/01_understand/references/interface-evidence.md
      when: the outcome changes a product interface or customer-facing provider flow
---

# 01_understand — Understand the problem and desired outcome

One job: establish the intended behavior, scope, and observable acceptance.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The user request, current product behavior, and only the domain or interface owners needed to resolve this outcome.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Establish the user, problem, desired outcome, fixed constraints, scope, and material unknowns. Reuse answers and decisions already given.
2. Inspect the existing behavior and its owners. When credible alternatives have materially different consequences, explain the choices and sacrifices; otherwise proceed with the clear approach.
3. For a UI-affecting outcome, follow [Interface evidence](references/interface-evidence.md). Initiate a preview when it resolves uncertainty and reconcile what it teaches into the accepted behavior.
4. Define observable acceptance and the smallest sufficient proof. Keep decisions in chat/PR; use a living Project brief only when durable coordination needs it.
5. Use bounded technical inspection or [Design](../02_design/CONTEXT.md) when feasibility can change the product decision. Carry the evidence back to this decision owner.

## Outputs

- Accepted intent, behavior, scope, and acceptance in chat/PR or the living brief.
- Relevant interface evidence and explicit questions that still affect the result.

## Human check

Reuse existing authority for clear work. Resolve material product choices or missing authority before dependent implementation. Continue to Design or Build when the needed decisions are already settled.

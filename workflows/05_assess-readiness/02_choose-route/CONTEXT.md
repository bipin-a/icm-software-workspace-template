---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Technical choices, Acceptance and proof, Links]
  references:
    - path: _shared/engineering/github-delivery-rules.md
      headings: [Checks and delivery truth, Traceability and human gates, Merge methods preserve evidence and history]
---

# 02_choose-route — Choose the next delivery action

One job: decide whether the candidate is ready for the requested next action.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact candidate, validation evidence, finding dispositions, live merge preconditions when relevant, and the requested completion boundary.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify candidate identity, applicable proof, finding dispositions, and outstanding obligations. Required checks or unresolved material choices remain blocking unless their owning authority changes the requirement.
2. Choose the actual next route: resolve intent in Understand, design in Design, correct in Build, obtain proof in Validate, finish local work, merge when authorized, or enter Release when deployment is requested.
3. Before an authorized merge, verify current head, base, live repository policy, required checks, and review preconditions. Use the permitted method and verify the result.
4. Record the decision and accepted risks on the owning chat/PR. Keep release authority separate from merge readiness; non-deployment work is complete at its requested boundary.
5. Apply [Learn](../../07_learn/CONTEXT.md) only when an evidence-backed correction is earned. Do not create another artifact just to close a stage.

## Outputs

- A supported readiness decision and next route, plus verified merge evidence when that action is authorized and completed.

## Human check

Continue within explicit authority for completion or merge. Resolve missing release authority through the Release procedure before environment writes.

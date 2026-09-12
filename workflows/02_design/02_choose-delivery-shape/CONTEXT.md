---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Technical choices, Acceptance and proof, Open questions]
  selectors:
    - path: _shared/engineering/multi-pr-delivery.md
      when: dependencies, independent review boundaries, or release risk need several PRs to converge
---

# 02_choose-delivery-shape — Choose a proportionate delivery shape

One job: complete the selected technical proposal's delivery shape and resolve missing authority in their combined review.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The selected technical approach, existing delivery constraints, and any material dependencies.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Reference the selected technical proposal and applicable decision revisions. Technical approval is not required merely to draft this plan. Check material value, effort, risk, and uncertainty using existing evidence.
2. Keep one reviewable and verifiable PR as the default. Add work ordering, vertical slices, or a separate coordination plan only when dependencies, review boundaries, migration, or rollout require it.
3. For several PRs, apply [Multi-PR delivery](../../../_shared/engineering/multi-pr-delivery.md). Name slice outcomes, blockers, merge conditions, integration lifetime, and combined proof.
4. Make material omissions and sacrifices explicit. Do not trade away accepted security, accessibility, data integrity, or recovery obligations merely to reduce effort.
5. Reference the technical owner's environments, migration, rollback, and monitoring decisions; record only delivery-specific ordering and gates here. Return a material mismatch in cost or architecture to technical design and changed behavior to Understand.
6. Present unresolved technical and delivery choices together. Reuse existing authority and finalize mutually applicable decisions before creating dependent delivery objects or continuing to Build.

## Outputs

- The chosen delivery shape and any necessary dependencies, human checkpoints, environment sequence, and proof obligations in the owning chat/PR or brief.

## Human check

Resolve missing authority for the technical proposal and delivery shape in one review. One PR needs no Delivery Assessment, diagram, or separate planning approval. A diagram is optional and derives from its canonical plan.

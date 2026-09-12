---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Acceptance and proof, Links]
  selectors:
    - path: _shared/engineering/multi-pr-delivery.md
      when: the candidate combines several PRs
      headings: [Coordinate, Finish]
---

# 04_assemble-candidate — Identify the complete candidate

One job: pin the candidate whose combined behavior must be validated.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The candidate branch or PR, exact base and head, included changes, existing proof, and live child links when applicable.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. For one PR, identify its complete candidate. For coordinated delivery, verify required slices are included and their merge conditions were satisfied under the accepted plan.
2. Check the combined change and integration obligations. Child completion or proof does not establish combined correctness.
3. Record the candidate base and head, included scope, proof links, and remaining obligations on the owning PR; link it from the brief when present.
4. Continue to [Validate](../../04_validate/CONTEXT.md). On a later change, compare against the tested revision and identify only the decisions and proof affected.

## Outputs

- An exact candidate and scope with the evidence required for validation.

## Human check

Confirm unresolved scope or assembly choices before relying on the candidate. Reuse existing authority and preserve applicable merge conditions.

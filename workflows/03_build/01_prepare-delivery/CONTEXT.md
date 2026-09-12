---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Acceptance and proof, Links]
  references:
    - path: _shared/engineering/multi-pr-delivery.md
      headings: [Choose and prepare, Coordinate]
---

# 01_prepare-delivery — Prepare the selected delivery structure

One job: create or verify the coordination objects required by a multi-PR plan.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact base, branch policy, and live linked issue and PR dependencies needed by the accepted plan.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Use this substep only when several PRs need coordination. A single PR goes directly to implementation.
2. Verify the accepted plan, base, branch targets, slice boundaries, dependency order, integration lifetime, and authority for the required delivery objects.
3. Verify the existing Project branch descends from the accepted base and required decisions are reachable from the planned integration head; they need not merge to the base first. Reuse that branch for integration and reuse existing issues. Create only the missing objects the selected plan requires.
4. Read back created objects, link their stable identities from the brief or owning PR, and select an unblocked slice from live state.

## Outputs

- Verified coordination links, branch targets, and one unblocked implementation slice.

## Human check

Reuse authority for the accepted plan. Resolve a changed base, overlap, or missing material dependency decision before creating dependent objects.

---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/design-build.md
    heading: 03_build-prepare
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Delivery profile, Human decision]
      tables:
        - heading: Proposed delivery slices
          columns: [Slice, Product criteria, Blockers or merge conditions]
---

# 01_prepare-delivery — establish the approved delivery topology

One job: create or verify an approved multi-pull-request issue and branch
structure. This step does not inspect or implement product code; a single-pull-
request profile skips it.

## Inputs

- Repository inputs, selected headings and columns, and profile are declared by
  `context` above.
- Live external state: read only the linked issues' identity, state, dependency
  relationships, bounded blocker information, configured base, pull requests,
  and branch-protection evidence needed to establish the approved topology.

Do not load specification bodies, implementation files, test code, complete
issue bodies, environment credentials, or another stage's references.

## Process

1. Verify the approved assessment revision, multi-pull-request profile, slice
   identities, dependency order, integration-branch lifetime, and human
   decision. Stop when the approved profile does not require this topology.
2. Verify the exact base. Stop if the approved Project artifacts are not
   reachable from it; do not create an unapproved stacked topology.
3. Reuse approved issues where they already own the slices. Create only missing
   delivery objects required by the approved profile.
4. Create the integration branch from the verified base and a draft integration
   pull request to the configured base; target child pull requests to the
   integration branch.
5. Link the stable parent issue, child issues, integration branch, and draft
   integration pull request from the Project without copying changing status.
6. Read back every created object and derive the available frontier from live
   delivery state.

## Outputs

- Exact integration branch and draft integration pull request
- Stable delivery links in the Project record
- One live frontier slice selected for implementation

## Human check

Confirm the base revision, branch targets, issue membership and dependencies,
draft integration pull request, and selected frontier before implementation.

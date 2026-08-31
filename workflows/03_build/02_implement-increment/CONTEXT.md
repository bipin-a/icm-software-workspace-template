---
type: workflow-step
context:
  parameters: [slice, criteria]
  profile:
    path: _shared/engineering/profiles/design-build.md
    heading: 03_build-increment
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Human decision]
      tables:
        - heading: Proposed delivery slices
          match: prefix
          values: ["{slice}. "]
    - path: projects/<project-slug>/specs/product-spec.md
      tables:
        - heading: Acceptance criteria
          match: prefix
          values: ["{criteria}"]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Proposed system behavior
        - Interface evidence and system consequences
        - Architecture and canonical owners
        - Domain and data model
        - Interfaces and contracts
        - Environments and test data
        - Technology and third-party choices
        - Analytics and observability
        - Security, privacy, isolation, and destructive behavior
        - Migration and compatibility
        - Release, rollback, and monitoring
        - Approved decisions
        - Risks and open questions
      tables:
        - heading: Testing and acceptance proof
          match: contains
          values: ["{criteria}"]
---

# 02_implement-increment — complete one accepted slice increment

One job: implement and commit one coherent, proof-driven increment of one
unblocked slice. Another fresh context handles the next increment or pull
request.

## Inputs

- Repository inputs, selected headings and rows, and profile are declared by
  `context` above.
- Live working input: the full body and current blockers of one Project-linked
  delivery item. The configured delivery system owns live slice state; the
  pinned specifications own acceptance.
- Working: the approved base and implementation branch plus only the repository
  files needed to trace, test, and change this increment's named public seams.
- Capability routing: `../../CONTEXT.md`.

Do not load unselected specification sections, other issue bodies, another
increment's code, pull-request publication rules, another stage's references,
or the complete engineering library. Route backward if the delivery item and
specifications disagree.

## Process

1. Verify the exact approved artifact revisions, delivery item, blockers, base,
   branch, selected acceptance criterion, current diff, and repository status.
   Use the repository's configured dependency bootstrap when required.
2. Trace the criterion's public seam and classify only the caller shapes this
   increment changes.
3. For a regression or high-consequence risk, reproduce the intended failure
   before the fix. For an ordinary feature, reuse existing proof or add focused
   proof only when the criterion or a credible risk earns it. Then implement
   the smallest complete observable outcome and make the selected proof pass.
4. Run focused checks, inspect the resulting diff, and commit only this coherent
   increment without publishing or merging it.
5. Derive the handoff from the exact commit, parent, changed files, test
   command, result, skipped proof, remaining criteria, and repository status.

## Outputs

- One exact implementation commit on the selected branch
- Its accepted criterion, focused proof, omissions, and remaining criteria

Do not create a Build Summary, Iteration Log, or generic workstream record.

## Human check

Confirm the delivery item, criterion, commit, proof, skipped checks, remaining
work, and branch target. This does not publish, merge, validate, or release the
increment.

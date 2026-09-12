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
    - path: workflows/06_release/references/release-rules.md
      headings: [Authority and boundary, Verify and decide]
---

# 04_decide-environment — Decide the environment result and next route

One job: choose the next action from the actual deployment and verification evidence.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The actual deployed source and target, terminal proof, partial writes, failures, skipped checks, monitoring, rollback limits, and remaining release authority.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify that the evidence belongs to this source and environment and that omissions or partial state are explicit.
2. Choose the supported action: accept completion, plan the next environment, revise the candidate, retry, contain, roll back, or stop.
3. Continue only within the accepted environment sequence and authority. Return a materially changed plan to planning and resolve missing authority before writes.
4. Record the result, owner, remaining monitoring or recovery obligations, and next route on the canonical release surface. Link it from a selected brief.

## Outputs

- An evidence-backed environment decision and the exact next action with its authority boundary.

## Human check

Use existing authority where it covers the decision. Obtain the missing decision for production or a changed action; success in an earlier environment creates no additional authority.

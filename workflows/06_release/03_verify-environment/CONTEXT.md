---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Links]
  references:
    - path: workflows/06_release/references/release-rules.md
      headings: [Verify and decide]
---

# 03_verify-environment — Verify the deployed behavior

One job: prove the required behavior on the actual deployed source and environment.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The deployment attempt, actual source and target identities, data and migration state, required proof, and current monitoring evidence.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify deployed source and configuration against the intended candidate and target. Account for every partial write or failed action.
2. Reuse applicable routing or smoke evidence for this exact attempt; run it when required and not yet terminal. Then run the selected environment proof with its actual data and reset constraints. Reachability alone does not prove behavior, persistence, migration, or isolation.
3. Record exact procedures, results, what the environment proves, production differences, failures, skipped proof, monitoring, and rollback limits.
4. Carry the terminal evidence into the environment decision. Do not broaden recovery or promotion authority through a successful check.

## Outputs

- Environment-specific proof, failures, omissions, and monitoring or recovery obligations tied to the deployed source.

## Human check

Resolve material evidence gaps before accepting the environment result. Use the existing release plan for authorized verification and recovery.

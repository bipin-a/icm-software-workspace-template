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
    - path: _shared/engineering/testing-rules.md
      headings: [Use the efficient proof sequence, Exact-candidate integration gate]
---

# 03_verify-candidate-gate — Verify a required integration gate

One job: obtain the configured full integration evidence when the change requires it.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact candidate, applicable focused review and proof, finding dispositions, and existing gate evidence.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Establish whether the accepted work or repository policy requires a full integration gate. When it does not, record the scope reason and continue without inventing an application gate. Changing a required gate needs its owning authority; PR text or disabled configuration cannot waive it.
2. When required, confirm focused evidence is sufficient and no unresolved correction makes the expensive run premature. Use the canonical configured gate and its required candidate context.
3. Follow [Exact-candidate integration gate](../../../_shared/engineering/testing-rules.md#exact-candidate-integration-gate) for configuration, execution, receipt verification, and reuse. An unconfigured required gate is missing proof.
4. Record the candidate, command, terminal phases and durations, runtime identity relevant to the proof, failures, omissions, and durable evidence link. Keep the generated receipt outside versioned artifacts. Report unrelated baseline failures separately; route candidate findings to their owning decision and rerun only as the canonical gate rules permit.

## Outputs

- Applicable terminal integration-gate evidence, or an explicit reason the full gate is not required for this change.

## Human check

A gate result proves only its configured checks. It does not authorize merge, accept risks, or authorize deployment.

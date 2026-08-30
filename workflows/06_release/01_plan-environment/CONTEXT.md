---
type: workflow-step
context:
  parameters: [environment]
  profile:
    path: _shared/engineering/profiles/release-learn.md
    heading: 06_release-plan
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Migration and compatibility
        - Release, rollback, and monitoring
        - Risks and open questions
      tables:
        - heading: Environments and test data
          match: prefix
          values: ["{environment}"]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Final proof and release shape, Human decision]
  references:
    - path: icm.config.json
    - path: workflows/06_release/references/release-rules.md
      headings: [Authority and boundary, Plan before writes]
---

# 01_plan-environment — prepare one no-write release plan

One job: produce and review a credential-free, no-write plan for one candidate
and one environment. This step does not authorize or perform deployment.

## Inputs

- Repository inputs, selected headings and rows, profile, and reference are
  declared by `context` above.
- Live working input: exact accepted candidate, selected environment, clean
  release context, and current source and target identities.
- Operator-local input: the configured credential and environment sources;
  never load or record their secret values.

Do not load implementation code, unrelated specification sections, raw
credentials, another environment's configuration, deployment logs, another
stage's references, or the engineering library.

## Process

1. Confirm the environment is listed in `release.allowedEnvironments`, then pin
   the accepted candidate, clean release context, approved artifacts, proof
   obligations, rollback boundary, and monitoring obligations.
2. Use the repository's configured deployment procedure in no-write or plan
   mode. If it has no trustworthy no-write mode, stop and obtain an approved
   procedure rather than simulating success.
3. Confirm that the plan performs no remote write and compare every reported
   source, target, migration, and action with the accepted specification.
4. Record non-secret plan evidence and any contradiction on the canonical
   release surface. Do not carry approval from a different candidate, plan, or
   environment.

## Outputs

- One non-secret no-write plan and stable evidence link
- Explicit human authorization or rejection for that exact plan

## Human check

Review the source, target, remote changes, proof, rollback, and monitoring
obligations before explicitly authorizing or rejecting this one environment.

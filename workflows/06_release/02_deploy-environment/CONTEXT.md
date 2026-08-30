---
type: workflow-step
context:
  parameters: [environment]
  profile:
    path: _shared/engineering/profiles/release-learn.md
    heading: 06_release-deploy
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Migration and compatibility
        - Release, rollback, and monitoring
  references:
    - path: workflows/06_release/references/release-rules.md
      headings: [Authority and boundary, Execute the authorized plan]
---

# 02_deploy-environment — execute one authorized plan

One job: execute one explicitly authorized environment plan and record every
completed or partial write. This step does not verify deployed behavior or
choose the next environment.

## Inputs

- Repository inputs, selected headings, profile, and reference are declared by
  `context` above.
- Live working input: exact candidate and environment, unchanged reviewed plan,
  explicit authorization, clean release context, and expected source identity.
- Operator-local input: configured credential and environment sources; never
  load or record their secret values.

Do not load implementation code, unrelated specification sections, raw
credentials, another environment's configuration, verification tests, another
stage's references, or the engineering library.

## Process

1. Reconfirm source, target, clean state, plan identity, authorization, and
   expected source immediately before execution.
2. Run the configured executor or provider procedure once for the authorized
   environment. Do not reconstruct, reorder, or broaden its remote writes.
3. Preserve non-secret output, source identity, every completed or partial
   remote write, and the last attempted action on failure.
4. Stop after the attempt. A partial or failed deployment is an incident state,
   not permission to retry, repair, roll back, or promote.

## Outputs

- Exact deployment attempt and source-identity records
- Stable evidence link including every completed or partial write

## Human check

Confirm the execution used the authorized candidate, plan, and target and that
the record is complete before verification or containment begins.

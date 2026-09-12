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
      headings: [Authority and boundary, Plan before writes]
---

# 01_plan-environment — Plan one environment change

One job: prepare a credential-free, no-write plan for one candidate and target.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The accepted candidate, selected environment, configured provider procedure, current source and target identities, and applicable migration, rollback, monitoring, and proof obligations.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify that the candidate, target, environment, and provider procedure are explicit. This source template supplies no deployment command or target.
2. Verify the clean source context and accepted revision. Prepare the concrete plan through the configured no-write procedure and confirm it performs no remote mutation. Identify each proposed action, migration, verification step, recovery boundary, and monitoring obligation.
3. Compare the plan with the accepted decisions and current environment evidence. Keep credential values out of the plan and its evidence.
4. Use existing human authority when it covers this exact plan. Resolve missing authority before proceeding to deployment.

## Outputs

- One concrete no-write plan, its evidence, and the source and scope of authorization or the unresolved decision.

## Human check

Review material source, target, write, proof, and recovery choices not already authorized. A plan or successful non-production run does not authorize production.

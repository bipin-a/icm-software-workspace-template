---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Links]
  references:
    - path: workflows/06_release/references/release-rules.md
      headings: [Authority and boundary, Execute the authorized plan]
---

# 02_deploy-environment — Execute the authorized environment plan

One job: perform the authorized writes and preserve complete execution evidence.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The unchanged plan, exact candidate and target, authorization, configured executor, and current execution context.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Recheck source, target, plan scope, authority, and execution context immediately before the write.
2. Run the configured procedure within its authorized scope. Do not infer targets or reconstruct a broader command.
3. Record the attempted action, source identity, completed and partial writes, non-secret results, and any failure.
4. On failure, use only recovery already authorized by the plan or resolve the missing recovery decision. Carry execution evidence into environment verification.

## Outputs

- The exact deployment attempt and a complete record of successful, failed, or partial actions.

## Human check

Reuse the authority for the unchanged plan. A material change in source, target, scope, or recovery action needs the corresponding decision before execution.

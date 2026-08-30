---
type: workflow-step
context:
  parameters: [environment]
  profile:
    path: _shared/engineering/profiles/release-learn.md
    heading: 06_release-decide
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Release, rollback, and monitoring
        - Risks and open questions
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Final proof and release shape, Human decision]
  references:
    - path: workflows/06_release/references/release-rules.md
      headings: [Verify and decide, Human check]
---

# 04_decide-environment — choose the release route

One job: choose the next route after terminal evidence for one environment and
exact source. This step does not deploy, merge, repair, or roll back.

## Inputs

- Repository inputs, selected headings, profile, and reference are declared by
  `context` above.
- Live working input: exact environment and deployed source, terminal proof,
  completed or partial writes, failures, skipped checks, monitoring, and
  rollback state.

Do not load implementation code, raw credentials, full deployment logs already
represented by terminal evidence, another environment's plan, another stage's
references, or the engineering library.

## Process

1. Verify the evidence belongs to the exact deployed source, environment, and
   target and that every partial write or skipped proof is represented.
2. Choose one route: plan the next approved environment, retry through a new
   plan, contain or roll back through an approved action, return to an earlier
   stage, or stop after production acceptance.
3. Record consequence, owner, monitoring and rollback obligations, and explicit
   authorization boundaries on the canonical release surface.
4. Link the durable decision from the Project. Production requires its own plan
   authorization and post-deploy acceptance; no environment advances
   automatically.

## Outputs

- One human environment decision and stable evidence link
- Exact next route with its authorization boundary

## Human check

Approve the environment result, consequences, obligations, and one next route.
This decision authorizes no unreviewed plan or different source.

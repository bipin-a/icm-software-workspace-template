---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/design-build.md
    heading: 03_build-assemble
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Delivery profile, Final proof and release shape, Human decision]
---

# 04_assemble-candidate — pin the exact candidate for Validate

One job: identify the complete Build candidate and hand its exact pull request
and head revision to Validate. This step does not independently validate or
merge it.

## Inputs

- Repository inputs, selected headings, and profile are declared by `context`
  above.
- Live working input: all Project-linked implementation pull requests and, for
  multi-pull-request delivery, the draft integration pull request and branch.
- Working: exact base and head identities, commit list, combined changed-file
  list, child proof links, and repository status for the assembled candidate.

Do not load full specifications, complete child diffs, implementation code,
environment state, another stage's references, or the engineering library.

## Process

1. Verify every release-blocking slice has its required pull request and that
   the approved merge conditions admit it to the candidate branch.
2. For multi-pull-request delivery, verify every required child is assembled
   into the exact integration head. For a single pull request, select its exact
   reviewed head.
3. Refresh any generated delivery view from live metadata without inventing or
   copying competing status.
4. Record the stable candidate pull-request link, base, and head revision in the
   Project.
5. Route that exact candidate to `../../04_validate/CONTEXT.md`. Any later head
   change invalidates downstream proof and returns here.

## Outputs

- Exact candidate pull request, base, head revision, and included child links
- Durable candidate handoff in the Project record

## Human check

Confirm the Project is complete at the approved Build scope and admit this exact
candidate to Validate. This is candidate-identity approval, not validation,
readiness, merge, deployment, or release approval.

---
type: workflow-step
context:
  parameters: [slice, criteria]
  profile:
    path: _shared/engineering/profiles/design-build.md
    heading: 03_build-publish
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Delivery profile, Human decision]
      tables:
        - heading: Proposed delivery slices
          match: prefix
          values: ["{slice}. "]
    - path: projects/<project-slug>/specs/product-spec.md
      headings: [Approved decisions]
      tables:
        - heading: Acceptance criteria
          match: prefix
          values: ["{criteria}"]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings: [Approved decisions, Risks and open questions]
      tables:
        - heading: Testing and acceptance proof
          match: contains
          values: ["{criteria}"]
---

# 03_publish-slice — publish one completed slice for review

One job: publish one completed branch for review without changing or merging
it.

## Inputs

- Repository inputs, selected headings and rows, and profile are declared by
  `context` above.
- Live input: linked delivery item, blockers, exact base and head, commits,
  diff, focused tests, and repository status.

Do not load other delivery items, unrelated code, another stage's references,
deployment state, environment credentials, or the complete engineering library.

## Process

1. Verify the delivery item, criteria, branch targets, commits, diff, proof, and
   approved omissions against the pinned artifacts. Route missing or
   contradicted work back to implementation.
2. Push the branch and create or update one pull request: target the integration
   branch for multi-pull-request delivery and the configured base for a single
   pull request.
3. Record exact artifact revisions, validation, and omissions; link the delivery
   item and Project; then read back head, base, body, and checks.
4. Add only the stable pull-request link to the Project. Do not copy live state.

## Outputs

- Exact pull request, head revision, and durable Project link

## Human check

Confirm the delivery item, base and head, commits, proof, omissions, and review
surface. Child approval does not admit the assembled Project to Validate or
release.

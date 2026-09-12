---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Acceptance and proof, Links]
  references:
    - path: _shared/engineering/github-delivery-rules.md
      headings: [Repository hygiene and branches, Commits, Pull requests are human review surfaces, Checks and delivery truth]
---

# 03_publish-slice — Publish the completed slice for review

One job: publish the branch and make its complete change and proof reviewable.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- Exact branch base and head, the complete diff and commit list, proof, repository status, and linked delivery item when present.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify that the diff satisfies the accepted slice and that the base, head, proof, and omissions are exact. Return incomplete implementation to its owner.
2. Within the requested delivery scope, push and create or update the owning PR. Use the selected integration branch for coordinated delivery or the configured base for one PR.
3. Use the PR template to explain the final change, comparison revisions, validation, and remaining risks. Preserve the original human authority when recording decisions.
4. Read back the PR head, base, body, and live checks. Link the PR from a selected brief without copying its changing status.

## Outputs

- A published PR with the exact change, evidence, and stable coordination links.

## Human check

Publication supplies a review surface. Preserve applicable review and merge requirements; a published PR or green check does not create merge authority.

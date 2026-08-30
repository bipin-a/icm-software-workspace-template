---
type: project
id:
title:
workflow: project-delivery
parent_issue:
approval_contract: artifact-receipts
---

# Project

Create a Project by copying the `_templates/project/` folder to
`projects/<project-slug>/`. Add and link artifacts only when the workflow
produces them. `PROJECT.md` is the stable record and router; GitHub owns
changing issue, pull-request, and check status.

The `workflow` field selects a repository workflow. It is not live Project or
delivery status.

## Intent


## Desired outcome


## Scope


## Non-goals


## Completion

State any Project-specific completion requirement beyond the shared factory
definition at `_shared/definition-of-done.md`.

## Canonical artifacts

Add a link only after the artifact exists.

- Product Specification:
- Technical Specification:
- Delivery Assessment:
- Prototype Evidence:
- Architecture Investigations:
- Architecture Decision Records:
- Lessons:
- Approval receipts: `approvals/`

## GitHub delivery and release evidence

Link durable delivery and release evidence without copying live status or
provider-owned records here.

- Parent issue: use `parent_issue` in frontmatter
- Child issues:
- Implementation pull requests:
- Integration branch and pull request, when applicable:
- Validation checks and review findings:
- Production authorization, deployment, and verification evidence, when
  applicable:

## Open questions

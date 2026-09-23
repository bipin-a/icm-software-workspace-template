---
name: integration-review
description: Review an assembled PR or integration branch for cross-slice behavior, ownership, lifecycle, and public-contract gaps when the user requests a review.
---

Read [AGENTS.md](../../../AGENTS.md). Identify the exact base and candidate,
and select the owning living Project brief when one exists. Follow the [Validate stage](../../../workflows/04_validate/CONTEXT.md), the
[review rules](../../../workflows/04_validate/references/review-rules.md) and
only the triggered rules selected by that stage.

For multi-PR work, use the completion requirements in the team kit's
`extras/team-delivery/multi-pr-delivery.md`.
Review the complete assembled diff and affected workflows; child PR checks do
not establish integration correctness. Read live PR state from GitHub.

Record evidence and actionable findings on the owning chat or PR. Preserve the
reviewed and tested revisions. Review does not authorize merge or deployment.

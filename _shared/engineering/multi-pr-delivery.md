# Multi-PR delivery

Use only when the selected Project has `delivery_profile: multi-pr`.

One job: assemble several independently reviewed implementation pull requests into one validated Project release.

## Ownership

| Surface | Owns |
|---|---|
| Project specifications | Product objective, complete acceptance contract, scope, and technical decisions |
| Parent GitHub issue | Delivery structure, child-ticket membership, progress, and links to the specifications |
| Child issue | One vertical slice, its blockers, priority, and release relevance |
| Child pull request | Focused implementation review and validation evidence for that slice |
| Integration branch | Assembled code for the complete Project or POC |
| Draft integration pull request | Delivery status, merge order, release gates, combined diff, and integrated proof |

GitHub child issues own live delivery metadata. Any status table or diagram in the parent issue and integration pull request is a generated view of that metadata and must not invent different dependencies, priorities, or release decisions.

## Set up

1. Confirm the human-approved Delivery Assessment, delivery profile, specifications, branch lifetime, and final proof.
2. Use the approved slice proposal to create narrow, independently reviewable vertical slices.
3. Keep development priority, dependency order, merge order, and release gates distinct.
4. Create the parent issue, child issues, integration branch, and draft integration pull request.
5. Link all delivery objects from the Project record.

After the delivery objects are published, GitHub owns their live status. The approved Delivery Assessment remains the record of the trade-off decision; it does not mirror ongoing GitHub progress.

Do not split one behaviour into separate database, API, interface, and test tickets merely to create more tickets.

## Deliver

1. Work only on child issues whose blockers are complete.
2. Target child pull requests at the integration branch.
3. Require focused review and validation before merging each child.
4. Keep the integration branch synchronized with `main` at planned checkpoints.
5. Update the GitHub delivery view when blockers, priorities, gates, issues, or pull requests change.
6. Record spikes, repairs, removals, and course corrections as first-class delivery work.

Implementation completion does not itself grant permission to merge.

## Complete

The integration pull request remains a draft until:

- every release-blocking child issue is satisfied;
- every required child pull request is assembled;
- the combined behaviour and relevant operational paths pass validation;
- required human gates have explicit approval; and
- the exact commits, validation evidence, omissions, and remaining risks are recorded.

After merge, preserve GitHub as the historical delivery record and link the final issue, pull request, commit, deployment, and lessons from the Project summaries.

---
type: project-library-router
status: active
---

# Projects

One job: select one durable Project record and route its next action without
copying live pull-request, check, approval, or deployment state into the
repository.

## Start

1. Confirm [`../setup/questionnaire.md`](../setup/questionnaire.md) is complete.
2. If the user names a Project, open only
   `projects/<project-slug>/PROJECT.md` first.
3. If the Project does not exist, choose a unique kebab-case slug, copy the
   [`PROJECT.md` template](../_templates/project/PROJECT.md) to that path, and
   complete it before creating another artifact.
4. Follow the `workflow` named by the Project record. Use
   [`../workflows/CONTEXT.md`](../workflows/CONTEXT.md) for `project-delivery`.

Do not scan every Project or infer that an unlinked issue, pull request, branch,
approval, or deployment belongs to the selected Project.

## Determine the next route

1. Report the durable repository handoff from `PROJECT.md` and the exact
   artifact revisions it links.
2. New Projects use `approval_contract: artifact-receipts`. Validate exact
   Product Specification, Technical Specification, and Delivery Assessment
   receipts out of band with `npm --prefix tools/icm run check`. A receipt
   identifies evidence; it does not create or prove human approval merely by
   existing.
3. Select the earliest workflow stage whose required artifact is absent,
   rejected, stale, or invalidated by a changed upstream identity.
4. When the next stage is owned by Git, a pull-request or check system, an
   approval surface, or a deployment provider, follow only the exact Project
   link and read current state from that owner.
5. Report `Repository handoff` separately from `Live external state`. Name the
   owner checked and when, or state that live state was not checked.
6. Never copy changing provider status into Project frontmatter or infer it from
   a branch name, green check, or deployed resource.

A Project may return to an earlier stage when an accepted input changes. It
remains one Project at one stable path. Git and the configured delivery system
own implementation chronology; Project artifacts retain only durable intent,
decisions, links, and earned evidence.

Do not add a Project-local `CONTEXT.md` unless the Project becomes a genuine
sub-workspace with its own repeating workflow and human gates.

## Architecture investigations

Keep an investigation with its sponsoring Project when one Project naturally
owns the evidence. Use [`../architecture/`](../architecture/CONTEXT.md) only
when several Projects share the question and no Project is the natural owner.
Findings are evidence; accepted specifications and earned ADRs own decisions.

## Outputs

- One selected `projects/<project-slug>/PROJECT.md`
- The exact workflow contract for its next valid action
- A status report separating durable repository evidence from current external
  state

## Human check

Confirm the selected Project, exact artifact identities, approval evidence,
external owners, observed live state, and next route before changing an
artifact or external system.

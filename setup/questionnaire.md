---
type: factory-setup
status: incomplete
---

# Setup questionnaire

Use current answers first. This file owns setup scope and completion, not a
second copy of accepted answers. Write decisions to the owners below.

## Decisions needed to begin

0. **Size:** is this a **solo** repository (one person, no deployment
   pipeline, one PR at a time: a take-home, spike, or script) or a **team**
   repository (several PRs, a full candidate gate, or deployments)? Apply the
   answer first with `npm --prefix tools/icm run setup -- --size <solo|team>`.
   Solo removes the team kit, the Assess Readiness and Release stages, and the
   to-tickets skill; this cannot be undone in place, so choose team when unsure.
1. **Identity and outcome:** who uses the workspace, what is being built, who
   owns material decisions, and where does existing application code live?
2. **Code audience and quality bar:** who reads, maintains, or presents the
   code, and what bar applies: production, prototype, or demonstration (such
   as a take-home walkthrough)? Size describes team structure, not this bar;
   a solo repository can still be production software.
3. **Shared constraints:** which domain, security, privacy, accessibility,
   migration, and operational rules apply across work? Show the starter
   defaults that most affect the output (quality bar, test depth, tolerance
   for abstraction, documentation volume) and have the human confirm or
   revise each. Do not record inherited defaults as accepted without showing them.
4. **Review and delivery:** where do human decisions and implementation reviews
   live? What branch, merge, required-check, and authorization rules apply?
   Read live settings when those rules depend on an external repository.
5. **Proof:** what executable checks and environments already exist? Which
   focused commands prove current work, and what scope requires a full gate?
6. **Reusable inputs:** what existing data, references, services, or design
   assets may be used, with what access and freshness limits?

## Conditional decisions

- Before the first application implementation requiring a stack or proof:
  select the source layout, native package/dependency commands, and real tests
  in the owning feature decisions and executable configuration.
- Team size, before a required full gate: configure complete real command
  phases in `icm.config.json` and verify its clean linked-worktree execution
  and receipt.
- Team size, before any deployment: select the provider procedure, explicit targets,
  environment sequence, authorization owner, migration/rollback obligations,
  and live verification under the release rules.
- When a domain rule becomes shared: record it once in the domain library and
  route consumers to it.

These are task triggers, not blockers to starting a new product before its
technology or deployment plan is known.

## Canonical output map

| Decision | Owner |
|---|---|
| Identity and source layout | `../README.md`, `../AGENTS.md`, `../CONTEXT.md`, `../app/README.md` |
| Code audience and quality bar | `../README.md`; restate in a Project's Technical choices when it differs |
| Voice | `../_shared/voice.md` |
| Shared constraints and domain meaning | Narrowest owner under `../_shared/`, linked from its catalog |
| Completion | `../_shared/definition-of-done.md` |
| Human review and decision revision | `../_shared/engineering/document-review.md` |
| Git delivery and live-state boundary | `../_shared/engineering/github-delivery-rules.md` |
| Proof commands and environments | Native executable configuration; applicability in `../_shared/engineering/testing-rules.md` |
| Size, context estimate, and team full-gate phases | `../icm.config.json` |
| Reusable external inputs | `../_shared/reusable-assets.md` |
| Deployment procedure and targets | Team size: `../workflows/06_release/references/release-rules.md` and its configured provider owner. Solo size: not applicable |
| Outcome-specific decisions | Chat/PR for bounded work; one living Project brief when coordination needs it |

## Verify completion

- Root, setup, feature, and Project routes resolve; profile headings and local
  links pass `npm --prefix tools/icm run check`.
- `npm --prefix tools/icm test` passes when workflow or tooling changed.
- Selected proof commands exist and run where applicable. Deferred choices have
  one trigger and owner; no pretend application gate has been configured.
- Authorized external changes were read back from their canonical owners.
- No source-product data, credentials, sample Project, or false approval status
  entered the workspace.
- The human accepted the consolidated setup. Then set `status: complete`.

The reusable source template stays `incomplete`. Instances do not repeat setup
unless their shared configuration is intentionally reopened.

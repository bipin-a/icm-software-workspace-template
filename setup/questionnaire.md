---
type: factory-setup
status: incomplete
---

# Setup questionnaire

Use current answers first. This file owns setup scope and completion, not a
second copy of accepted answers. Write decisions to the owners below.

## Decisions needed to begin

1. **Identity and outcome:** who uses the workspace, what is being built, who
   owns material decisions, and where does existing application code live?
2. **Shared constraints:** which domain, security, privacy, accessibility,
   migration, and operational rules apply across work? Accept or revise the
   starter voice and principles.
3. **Review and delivery:** where do human decisions and implementation reviews
   live? What branch, merge, required-check, and authorization rules apply?
   Read live settings when those rules depend on an external repository.
4. **Proof:** what executable checks and environments already exist? Which
   focused commands prove current work, and what scope requires a full gate?
5. **Reusable inputs:** what existing data, references, services, or design
   assets may be used, with what access and freshness limits?

## Conditional decisions

- Before the first application implementation requiring a stack or proof:
  select the source layout, native package/dependency commands, and real tests
  in the owning feature decisions and executable configuration.
- Before a required full gate: configure complete real command phases in
  `icm.config.json` and verify its clean linked-worktree execution and receipt.
- Before any deployment: select the provider procedure, explicit targets,
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
| Voice | `../_shared/voice.md` |
| Shared constraints and domain meaning | Narrowest owner under `../_shared/`, linked from its catalog |
| Completion | `../_shared/definition-of-done.md` |
| Human review and decision revision | `../_shared/engineering/document-review.md` |
| Git delivery and live-state boundary | `../_shared/engineering/github-delivery-rules.md` |
| Proof commands and environments | Native executable configuration; applicability in `../_shared/engineering/testing-rules.md` |
| Optional full-gate phases and context estimate | `../icm.config.json` |
| Reusable external inputs | `../_shared/reusable-assets.md` |
| Deployment procedure and targets | `../workflows/06_release/references/release-rules.md` and its configured provider owner |
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

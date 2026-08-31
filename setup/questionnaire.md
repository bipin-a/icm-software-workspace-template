---
type: factory-setup
status: incomplete
profile_version: 0.1.0
---

# Factory setup questionnaire

Answer the required decisions one at a time, then write accepted answers to the
canonical owners below. This file tracks setup scope and completion; it does not
retain a duplicate answer set.

## Required before the first Project

1. **Repository identity and outcome:** Who uses this workspace, who owns
   material decisions, what product and source paths exist, and what must be
   true for a Project workflow to count as finished?
2. **Repository communication:** Accept the starter `_shared/voice.md`, revise
   it, or replace it with representative evidence.
3. **Cross-Project constraints:** Which security, privacy, compliance, product,
   UX, format, migration, or operational safeguards apply to every Project?
4. **Project artifact approval:** Who may approve Product Specifications,
   Technical Specifications, Delivery Assessments, candidate findings, and
   releases? Which human-owned surface records each decision, and how does its
   receipt bind that evidence to the exact artifact identity?
5. **Candidate identity and proof:** If executable checks exist, which repository
   command is the complete candidate gate? What clean-worktree and dependency
   preconditions apply? Which named phases belong in `icm.config.json`, and
   which command verifies the machine-written phase and runtime receipt for the
   current Git tree? If no executable system exists yet, which Technical
   Specification and pre-Build gate must establish these answers?
6. **Proof and environment path:** Which focused and repository-wide commands
   exist, which local and non-production environments are used, what data is
   allowed, and when must changed evidence create a new candidate?
7. **Reusable inputs:** Which templates, data sources, prior artifacts,
   environments, or external references may Projects reuse? Record their
   canonical owner, access limits, and freshness expectations.
8. **Git and pull-request delivery:** Record the repository identity and
   visibility, protected-branch policy, pull-request rule, eligible approval
   rule, merge methods, branch convention, delivery profiles, required checks,
   and owner of changing delivery state.
9. **Release and deployment:** Name the deployment owner, environments,
   promotion sequence, authorization owner, rollback and monitoring obligations,
   and canonical live evidence. Do not infer provider settings from this
   template.

## Canonical output map

| Decision | Canonical owner |
|---|---|
| Repository identity and root routing | `../README.md`, `../AGENTS.md`, and `../CONTEXT.md` |
| Application and source layout | `../app/README.md`, root routing, and executable repository configuration |
| Finished Project workflow and human ownership | `../_shared/definition-of-done.md` |
| Repository communication | `../_shared/voice.md` |
| Shared reference selection | `../_shared/CONTEXT.md` |
| Cross-Project safeguards and principles | The narrowest applicable owner under `../_shared/` |
| Engineering context selection and bounds | `../_shared/engineering/CONTEXT.md`, its profile shelves, and `../icm.config.json` |
| Proof environments, commands, and candidate gate | `../icm.config.json` owns the gate shape; `../_shared/engineering/testing-rules.md`, each Project's Technical Specification, and executable repository configuration own the applicable commands and environments |
| Artifact approval shape | `../_templates/approval-receipt.md`, Project records, the configured human-owned approval surface, and `../tools/icm/check-workspace.mjs` |
| GitHub delivery and merge policy | `../_shared/engineering/github-delivery-rules.md` |
| Reusable inputs | `../_shared/reusable-assets.md` and the exact stage contracts that consume them; `_shared/CONTEXT.md` routes the internal shared library |
| Deployment and release policy | The provider-neutral Release contract plus a configured provider procedure when required |

## Verification required before completion

- Root setup and Project-selection walks resolve without an unspecified path.
- Every configured approval type identifies a human-owned source and exact
  artifact identity, and `npm --prefix tools/icm run check` passes. A receipt
  shape does not replace the human decision.
- When executable checks exist, `node tools/icm/candidate-gate.mjs` refuses an
  invalid candidate and produces evidence that
  `node tools/icm/verify-candidate-receipt.mjs` accepts only for the current Git
  tree. Otherwise `candidateGate.enabled` remains `false` and the pre-Build
  trigger and owner are explicit.
- Existing focused and full proof commands run at the intended repository
  boundary. Commands that depend on a later Technical Specification remain
  deferred to its named pre-Build gate instead of being invented during setup.
- Approved live repository and delivery settings were read back from their
  canonical systems.
- Local links and profile selectors pass `npm --prefix tools/icm run check`;
  representative context files are reported with
  `npm --prefix tools/icm run context -- <files...>` and retain the configured
  500-token reserve.
- No credentials, populated environment files, sample Project, instance data,
  or placeholder policy entered the factory.

## Earned later rather than invented during setup

- Product principles enter `_shared/principles/product-principles.md` only when
  an accepted cross-Project lesson earns one.
- Project-specific product behavior and brand voice belong to the Product
  Specification.
- Technology, provider, persistence, interface, and data choices belong to the
  applicable Technical Specification unless they are proven repository-wide
  constraints.
- Optional stack shelves apply only when the selected technology is in scope.
- Architecture investigations and ADRs are created only when a material
  uncertainty or durable decision earns them.

## Completion

Set `status: complete` only after the human approves the consolidated owners,
controls applicable during setup pass, deferred controls have one exact trigger
and owner, and live settings are verified. Future agents read those canonical
outputs and do not repeat setup unless the factory is intentionally
reconfigured.

# Migrating the unversioned template to 0.1.0

This guide applies to repositories derived from unversioned template commit
`7f500e7bd3964d920b8d19e7ce5f58a5bc98e552`. Release `0.1.0` is the first
versioned release; it is not an in-place product migration and it does not
replace an instantiated repository's code, history, or accepted decisions.

## Compatibility boundary

There are no compatibility paths. Retired workflow, reference, and template
paths are absent in `0.1.0`; there are no pointer files, aliases, or symlinks.
Update active referrers in the same migration. Git history and the source commit
above preserve the old blank templates.

Do not interpret that source cleanup as permission to delete populated files in
an instantiated repository. Preserve accepted evidence as described under
[Historical Project artifacts](#historical-project-artifacts).

## Before updating

1. Record the source commit and inventory tracked and untracked repository
   changes.
2. Identify each active Project and the exact approved specifications,
   delivery assessment, candidate, findings, release evidence, and decisions.
3. Identify the system that owns changing issue, pull-request, check,
   deployment, and environment state.
4. Apply the structural update on an isolated branch and update active
   referrers atomically.
5. Review the complete migration diff before admitting new Project work.

The template supplies new blank shapes. Existing product intent, application
layout, roadmap entries, architecture records, stack choices, and provider
configuration remain authoritative in the instantiated repository.

## Workspace and workflow paths

| Unversioned path or role | `0.1.0` owner | Migration action |
|---|---|---|
| Root `CONTEXT.md` workflow table | Root `CONTEXT.md` workspace router plus `workflows/CONTEXT.md` | Keep root as the entry router; move Project-stage selection to the workflow hub. |
| `workflows/01_spec-design/CONTEXT.md` | `workflows/01_understand/CONTEXT.md` and `workflows/02_design/01_choose-technical-design/CONTEXT.md` | Route product intent and interface evidence to Understand; route root cause and technical choice to Design. |
| `workflows/01_spec-design/references/specification-rules.md` | Understand interface-evidence reference, Product and Technical Specification templates, and their stage contracts | Preserve specification authority, interface evidence, prototype isolation, and promotion rules in the named owners. |
| `workflows/02_assess-delivery/CONTEXT.md` | `workflows/02_design/02_choose-delivery-shape/CONTEXT.md` | Update active links and remove stored references to the old stage. |
| `workflows/02_assess-delivery/references/delivery-assessment-rules.md` | Delivery-shape contract, engineering profile, Technical Specification, and Delivery Assessment | Preserve investment, proportionality, credible-option, future-readiness, and human-decision rules. |
| `workflows/03_build/CONTEXT.md` | Same parent path plus bounded Build steps | Keep the parent as a router; Git and the configured delivery surface own the exact implementation candidate. |
| `workflows/04_validate/CONTEXT.md` | Same parent path plus bounded Validate steps | Keep the parent as a router; store proof and findings on canonical exact-candidate surfaces. |
| `workflows/05_assess-readiness/CONTEXT.md` and `references/readiness-rules.md` | Same parent path plus one-finding disposition and route-selection steps | Move each disposition to its owning pull request, issue, or approval surface. |
| `workflows/06_release/CONTEXT.md` | Same parent path plus bounded environment steps | Link deployment, verification, and authorization evidence from their live owners. |
| `workflows/07_learn/CONTEXT.md` and `references/learning-rules.md` | `workflows/07_learn/CONTEXT.md` and `_templates/lesson.md` | Preserve one canonical correction owner and create a Lesson only when evidence earns it. |
| `workflows/architecture-spike/**` | Design plus `_templates/architecture-investigation.md` | Reconcile an active investigation into the combined artifact; do not create a second Project unless it has an independent outcome, priority, and release. |
| Root `architecture/` | Root `architecture/CONTEXT.md` | Retain for cross-Project working investigations with no natural Project custodian. |
| `_shared/architecture/decision-rules.md` | Same rules file plus `_shared/architecture/CONTEXT.md` | Retain decision criteria; use the new catalog for accepted cross-Project records. |
| `app/` and `roadmap/` | Same paths or the configured repository owners | Retain template boundaries. An instantiated repository may route them to its real application and roadmap owners. |

## Shared-reference paths

| Unversioned path or role | `0.1.0` owner | Migration action |
|---|---|---|
| `_shared/reusable-assets.md` as an internal catalog | `_shared/CONTEXT.md` | Route internal shared references through the catalog. Keep `reusable-assets.md` only for configured reusable inputs with an owner, access boundary, and freshness rule. |
| Whole engineering files loaded by a stage | `_shared/engineering/CONTEXT.md` and exact profile headings | Select only the headings named by the current working contract. |
| Cross-Project safeguards embedded in repository prose | `_shared/engineering/safeguards.md` | Admit only generic, self-contained protections; do not copy product-, stack-, or provider-specific rules from another repository. |
| `_shared/principles/product-principles.md` | Same path | Retain as the owner for earned cross-Project product principles. |
| `_shared/principles/ux-principles.md` | Same path | Retain normative UX principles and route them when interface decisions are in scope. |
| `_shared/ux/ui-ux-rules.md` | Same path | Retain review questions separately from normative principles. |
| `_shared/engineering/python-tooling.md` | Same path | Retain as an optional shelf and load it only when Python is in scope. |

## Template paths

| Unversioned path | `0.1.0` owner | Migration action |
|---|---|---|
| `_templates/prototype/prototype-brief.md` | `_templates/prototype-evidence.md` | Move the question, test, form, data path, scope, isolation, approval, and promotion decision into `Frame`. |
| `_templates/prototype/findings.md` | `_templates/prototype-evidence.md` | Move exact artifacts, observations, limits, specification changes, disposition, and remaining questions into `Findings`. |
| `_templates/architecture-spike/spike-brief.md` | `_templates/architecture-investigation.md` | Move the blocked decision, alternatives, affected boundaries, hold scope, evidence target, exclusions, stop condition, and frame approval into `Frame`. |
| `_templates/architecture-spike/findings.md` | `_templates/architecture-investigation.md` | Move exact evidence, limitations, comparison, impact, recommendation, and experiment-code disposition into `Findings`. |
| `_templates/architecture-spike/decision-summary.md` | `_templates/architecture-investigation.md` and optional `_templates/adr.md` | Move the human decision, source updates, affected Project routes, and remaining risk into `Human decision and routing`; create an ADR only when the decision earns one. |
| `_templates/summaries/build-summary.md` | Exact pull request or commit | Move specification trace, actual delta, tests, skipped checks, and remaining work to the exact candidate's canonical delivery record. |
| `_templates/summaries/validation-summary.md` | Pull-request validation, terminal checks, review evidence, or another configured exact-candidate record | Preserve candidate identity, environment and data context, acceptance proof, findings, checks, limits, and uncertainty. |
| `_templates/summaries/readiness-decision.md` | Owning pull request, issue, or configured approval surface | Preserve finding dispositions, accepted risks, decision owner, and route for the unchanged candidate. |
| `_templates/summaries/release-summary.md` | Deployment/environment provider and configured release-proof surface | Preserve authorization, released candidate, live checks, rollback, monitoring, and evidence links. |
| `_templates/summaries/iteration-log.md` | Git, delivery, and deployment history; `_templates/lesson.md` for durable reasoning | Do not copy chronology into a repository log. Preserve an earned explanation in a Lesson and its corrected canonical owner. |

## Project record fields

The `PROJECT.md` template now records stable identity, intent, artifact links,
and durable external evidence links. It does not copy changing workflow or
delivery state.

| Unversioned field or section | `0.1.0` owner |
|---|---|
| `id`, `title` | Same fields, with `type: project`. |
| `status` | Owning issue or configured Project approval surface; do not infer it from the file. |
| `workflow_stage` | The earliest incomplete or invalidated handoff selected through `workflow: project-delivery` and `workflows/CONTEXT.md`; do not persist live stage status. |
| `iteration`, `current_build` | Exact commit, pull request head, build, check, or deployment owner. |
| `architecture_hold`, `active_spike`, `affected_by_spikes` | Architecture Investigation, affected Project artifacts, and owning delivery issues or decisions. |
| `delivery_profile`, `delivery_assessment` | Approved Delivery Assessment; live topology stays in the delivery system. |
| `parent_issue` | Same stable link field. |
| `integration_branch`, `integration_pr` | `GitHub delivery and release evidence`; GitHub owns their changing state. |
| Current Build, Validation, Readiness, Iteration, and Release links | Historical artifacts remain evidence; new work links exact canonical delivery, validation, approval, and deployment records. |
| Per-stage workflow links | `workflow: project-delivery` plus the shared workflow hub. |
| Human artifact acceptance | `approval_contract: artifact-receipts` and `_templates/approval-receipt.md`. |

Do not mechanically remove legacy frontmatter from an active Project until its
exact durable handoff and live external owner are identified. Once migrated,
remove fields that can disagree with those owners.

## Specification, assessment, ADR, and Lesson fields

### Product Specification

- `UI/UX states and flows` becomes `Product workflow and reachable states`,
  with explicit relevant and excluded states.
- Interface evidence retains the current surface, evidence location, fidelity,
  findings, and skip rationale, and adds interface ownership and reviewed UX
  principle exceptions.
- `Behaviour and rules` becomes `Product behavior and rules`.
- Acceptance prose becomes a stable-ID table with observable criteria, relevant
  states or data, and required evidence.
- Product behavior alternatives use `decision_mode`,
  `selected_product_option`, and `Product behavior options`; do not invent
  alternatives for a single-track change.

### Technical Specification

- `Current system` now separates verified root cause from the existing-system
  inventory and the reuse or no-new-mechanism question.
- `Interface evidence and system consequences` remains the owner for technical
  consequences of approved product evidence.
- `Architecture overview` and `Architecture decisions` become `Design options
  and decision`, `Architecture and canonical owners`, `Approved decisions`, and
  an ADR when earned.
- Domain concepts, ownership, persistence, identifiers, relationships, and
  migration pressure remain under `Domain and data model`.
- Environment data source, reset, privacy or access constraints, production
  differences, and intended proof remain in `Environments and test data`.
- Required scenarios, invariants, dataset versioning, and schema compatibility
  remain explicit.
- `Testing` becomes a criterion-or-risk proof table plus required repository,
  non-production, production, and skipped proof.
- Release and rollback add monitoring as one canonical contract.

### Delivery Assessment

- The old implementation-option table splits between Technical Specification
  design options and Delivery Assessment delivery shapes.
- Project-wide size, risk, fragility, affected surfaces, validation burden, and
  uncertainty move to `Delivery proportionality`; slice-specific size, risk,
  and uncertainty remain in `Proposed delivery slices`.
- Architecture holds become linked decisions, investigations, and human
  checkpoints. Changing status belongs to the owning delivery surface.
- The Mermaid dependency map is retired because the slice table and delivery
  system own the plan and live dependency state.
- Final combined proof, environments, operations, migration, rollback,
  monitoring, and human release gates move to `Final proof and release shape`.

### ADR and Lesson

- ADR context, rationale, alternatives, consequences, affected Projects, and
  evidence remain, with explicit canonical-source updates and supersession
  conditions.
- Lessons retain failure class, expected behavior, evidence, failed control,
  correction owner, future detection, and remaining risk. They add scope,
  recurrence credibility, and human disposition.
- A Lesson remains evidence. Its accepted correction belongs in one canonical
  source, and a live safeguard must contain its own complete reason.

## Historical Project artifacts

Populated files created from retired templates are historical evidence, not
obsolete blank scaffolding.

- Do not bulk-delete or rewrite accepted summaries, spike records, prototype
  records, or iteration logs.
- Keep a populated artifact at its current path when moving it would break
  inbound links. Mark it historical or superseded only when that status is
  true, and link the current owner.
- Before retiring an active summary, move every still-current decision, risk,
  proof obligation, and evidence link to its canonical delivery, validation,
  approval, or deployment owner.
- For an unfinished prototype or architecture spike, either finish it under the
  old source version or reconcile its frame, findings, and decision into the
  new combined artifact with provenance links. Do not duplicate both as active
  owners.
- Do not manufacture new combined artifacts for completed historical work only
  to match the new shape.

Historical files retained by an instantiated repository are not compatibility
paths in this template. New workflow contracts must not route new work to them.

## Verification

After the complete update:

1. Confirm no active contract or template references a retired path.
2. Resolve every Markdown link from its containing file.
3. Confirm every active Project links one exact current specification pair and
   the applicable external candidate and evidence owners.
4. Confirm no populated historical artifact was deleted without a verified
   replacement and human approval.
5. Run `node tools/icm/check-context-budget.mjs` and the instantiated
   repository's normal documentation or link checks.

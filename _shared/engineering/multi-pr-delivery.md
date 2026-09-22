# Multi-PR delivery

Use only when dependencies, independent review boundaries, or release risk need
several PRs to converge. One reviewable and verifiable PR remains the default.
The living brief or an earned linked coordination plan owns work ordering and
proof obligations; GitHub owns changing delivery state.

## Choose and prepare

Explain the benefit, integration-branch lifetime, synchronization cost, and
final proof before creating dependent live objects. Reuse existing authority.
Prefer vertical slices that each demonstrate an observable result; do not split
database, API, interface, and tests merely to make more tickets.

For each slice, distinguish priority, technical blockers, merge conditions, and
release gates. Name its outcome, canonical owners, and discriminating proof.

## Coordinate

- Keep the existing Project branch as the integration branch when applicable.
- Use one draft integration PR and a parent issue when ticket coordination
  needs it. Link the brief and child PRs; do not duplicate acceptance.
- Target children at the integration branch. Define merge methods and trunk
  synchronization points before assembly.
- Read blockers and current status from GitHub. If a delivery view is useful,
  derive it from that metadata and link it; do not hand-maintain another state
  table in the brief.
- Work concurrently only when owners and files do not conflict. Completion of a
  slice does not authorize its merge.
- Record repairs and course corrections in the delivery record when they
  change dependencies or release obligations.

## Finish

Review the complete assembled diff and cross-slice behavior. Run the required
integrated proof on the exact candidate after child findings are resolved.
Retain original review and tested revisions; verify current merge preconditions.
Release follows the same explicit authorization and environment verification as
single-PR work. Link the final delivery evidence from the brief.

Use the [to-tickets skill](../../.agents/skills/to-tickets/SKILL.md) to prepare
slices and the [integration-review skill](../../.agents/skills/integration-review/SKILL.md)
when reviewing an assembled candidate. Both route to these existing owners.

## Supported integration workflow

Select this mode explicitly when multi-PR coordination is warranted:

1. Identify the accepted brief, trunk, existing Project branch, and current base.
   Use that Project branch as the integration branch; do not introduce an
   artifact-only precursor branch or PR.
2. Present the dependency graph, priorities, proof obligations, release blockers,
   safe parallel lanes, synchronization points, and human checkpoints.
3. Within authorized scope, create one parent issue and a draft integration PR
   targeting trunk. Create child issues in prerequisite order and record their
   actual identities. Use the [delivery-view metadata](delivery-views.md) as the
   single owner of changing coordination fields.
4. Target each child PR at the integration branch. Keep an independently
   observable result, its tests, and its relevant layers together in each slice.
5. Squash children into integration after focused proof, review, and applicable
   human authorization. Merge trunk into integration at planned checkpoints and
   before final validation. Prefer unrelated fixes on trunk first, followed by
   an explicit integration synchronization.
6. Recompute the frontier and refresh both generated views after each material
   change. Do not infer final integration correctness from passing child checks.
7. Review the complete assembled candidate, resolve findings, and run required
   integrated proof on its exact revision. Keep the integration PR draft until
   release-blocking work, proof, and human readiness decisions are complete.
8. Merge integration to trunk with a merge commit preserving the validated head
   as a parent, provided repository policy permits it. Verify the head and merge
   preconditions immediately before the merge. If repository policy forbids
   this shape, resolve the delivery-method decision before starting this mode.

A new integration commit invalidates assumptions about the previously tested
candidate; reuse only evidence whose explicit verifier and scope permit it.
After merge, link final implementation and release evidence from the brief.
The generated view does not replace deployment verification or human authority.

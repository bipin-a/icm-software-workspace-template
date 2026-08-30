# Multi-PR delivery

Use this structure only when an approved Delivery Assessment selects
`multi-pr`. Its one job is to assemble several independently reviewed pull
requests into one validated Project release. For a change that can be reviewed,
validated, and released safely in one pull request, use `single-pr`.

## Authority and delivery objects

| Surface | Owns |
|---|---|
| Project specifications | Product objective, acceptance contract, scope, and technical decisions |
| Project record | Stable links to specifications, assessment, delivery objects, and workflow artifacts |
| Parent GitHub delivery issue | Child membership, live delivery structure, progress, and specification links |
| Child GitHub issue | One vertical slice, blockers, development priority, merge conditions, and release relevance |
| Child pull request | Focused human review and validation evidence for that slice |
| Integration branch | Assembled code for the complete Project or proof of concept |
| Draft integration pull request | Derived delivery status, merge order, release gates, combined diff, and integrated proof |

Project specifications own intent and acceptance. GitHub issues own live
delivery metadata. A status table or diagram in the parent issue or integration
pull request is a generated view of that metadata; it must not invent a
different priority, dependency, merge condition, or release decision.

Do not copy changing GitHub status into Project specifications or hand-maintain
it in the Project record.

## Choose multi-PR delivery proportionately

Recommend `multi-pr` when two or more are true:

- several pull requests must work together before the outcome is useful;
- the assembled result needs shared-environment or end-to-end validation;
- slices have meaningful blockers or a required merge order;
- explicit human review or release gates apply;
- merging slices directly to trunk would expose incomplete behavior; or
- parallel delivery lanes must converge on one integrated proof.

Make the integration branch's expected lifetime, synchronization cost, child
pull-request shape, and final proof visible before implementation. The human
approves the delivery profile and shape.

## Design vertical slices

Each child issue should cut a narrow, observable path through the layers needed
for one result. Do not split one behavior into separate database, service,
interface, and test tickets merely to create more tickets.

For each proposed slice, state:

- the observable outcome and its owning Project criterion;
- development priority;
- technical blockers;
- required merge order or preconditions;
- release relevance;
- size, consequence risk, fragility, affected surfaces, and validation burden;
- the distinguishing proof and primary seam; and
- any human decision required before implementation or merge.

Keep development priority, dependency order, merge order, and release gate
distinct. A wide mechanical contract migration may instead use an approved
expand–migrate–contract sequence that names the temporary compatibility
contract, its live consumers, and its exact removal condition.

## Set up the delivery structure

1. Confirm the approved Delivery Assessment, specifications, delivery profile,
   integration-branch lifetime, slices, and final proof.
2. Present the frontier, critical path, safe parallel lanes, integration shape,
   and human checkpoints before publishing GitHub objects.
3. Create one parent delivery issue that links the specifications; it does not
   become a second specification.
4. Create child issues in dependency order so blocker relationships use real
   issue identities.
5. Create the integration branch from the approved trunk base and open one
   draft integration pull request to trunk.
6. Target child pull requests at the integration branch unless an approved
   exception names a different flow.
7. Link all delivery objects from the Project record.
8. Generate one delivery view from GitHub metadata and synchronize it to the
   parent issue and integration pull request.

Follow [`github-delivery-rules.md`](github-delivery-rules.md) for body
preservation, pull-request content, checks, merge methods, and live-state
verification.

An unrelated operational fix should normally land on trunk first and reach the
integration branch through a planned synchronization. Record any exception in
both GitHub delivery surfaces.

## Maintain the generated delivery view

The synchronized view is bounded by generated-region markers and contains only
live delivery state:

- development priority;
- child issue and implementation pull request;
- blockers;
- development and integration status;
- release relevance;
- critical path;
- available frontier; and
- unresolved human gates.

Refresh both copies when an issue or pull request opens, blockers or priority
change, a slice merges or is replaced, a human gate changes, or a spike, repair,
split, deferral, or removal changes delivery.

If synchronized regions disagree, regenerate them from canonical GitHub
metadata. Do not reconcile the two copies against each other. Human narrative
belongs outside generated markers.

## Work and merge the frontier

The **frontier** is every child issue whose blockers are complete. Frontier
items may proceed in parallel only when their worktrees, files, and canonical
decision owners do not overlap materially.

Implementation completion does not grant permission to merge. Merge a child
pull request only after focused review, validation, and declared merge
conditions pass. Verify the new integration head, refresh the delivery view,
and recalculate the frontier and critical path.

Synchronize the integration branch with trunk at planned checkpoints and before
final validation. Do not reverse the merge direction casually or merge the
integration branch into unrelated child branches.

## Complete the Project delivery

The integration pull request remains draft until:

- every release-blocking child issue is satisfied;
- every required child pull request is assembled;
- repairs and course corrections appear in the delivery record;
- required human gates have explicit approval;
- the integrated public workflow and applicable migration, deployment, and
  operational paths pass;
- the exact head, commits, validation, omissions, and remaining risks are
  recorded; and
- Assess Readiness approves the exact candidate.

After merge, GitHub remains the historical delivery record. The Project record
links the final issue, pull request, commit, deployment evidence, and accepted
Lessons without copying live delivery history.

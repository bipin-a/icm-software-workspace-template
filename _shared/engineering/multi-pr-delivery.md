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

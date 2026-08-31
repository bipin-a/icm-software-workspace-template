<!--
Documentation-only or mechanical pull request?
Keep Current Behavior, Exact Inputs and Candidate, Validation, and any material
Risks / Follow-ups. Replace irrelevant sections with one scoped N/A reason.
-->

## Current Behavior

### What works today, or what scenario used to be acceptable?

Describe the existing behavior in concrete product language. Do not begin with
implementation details.

### What new scenario exposed the problem?

Name the workflow, data shape, user action, integration path, or operational
condition that makes the old behavior insufficient.

### What consequence does this cause?

Explain what breaks, disappears, becomes misleading, corrupts data, or violates
an accepted product or technical rule. If the effect is internal, explain why
it still matters.

## Solution

### What changed?

Include material behavior, interfaces, migrations, compatibility, operations,
and removals.

- TODO

### Why this design?

Name the canonical owner and explain the selected trade-offs. State how the
change avoids a competing fallback, alias, or duplicate decision path.

### What remains intentionally out of scope?

- TODO

## Exact Inputs and Candidate

Link durable repository artifacts by exact revision. Link changing delivery and
approval state to the external system that owns it; do not copy live status.

- Project record: TODO
- Product Specification revision: TODO
- Technical Specification revision: TODO
- Delivery Assessment revision and profile: TODO
- Artifact approval evidence: TODO
- Owning issue or parent delivery issue: TODO
- Implementation pull request: TODO
- Comparison base SHA: TODO
- Candidate head SHA and Git tree: TODO
- Integration branch and pull request, when applicable: TODO or N/A
- Live external state checked at: TODO

## Review Focus

### Acceptance coverage

For behavioral work, map each accepted criterion to its distinguishing state,
action, observable consequence, and proof.

| Criterion | Initial state | Action or transition | Observable consequence | Discriminating proof |
|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO |

For each added test or coherent parameterized group, name its distinct job.

| Added proof | Protected guarantee | Primary seam | Why existing proof is insufficient |
|---|---|---|---|
| TODO or N/A | TODO or N/A | Workflow, public service, canonical rule, migration, or operation | TODO or N/A |

### Lifecycle and integration coverage

Mark only applicable states, or write `N/A — <reason>`.

- [ ] Fresh state
- [ ] Pre-existing state
- [ ] Later edit to the canonical owner
- [ ] Intentionally divergent linked records
- [ ] Disable, remove, reverse, or retire
- [ ] Reload, restart, or subsequent independent read
- [ ] Cross-slice producer and consumer seam
- [ ] Partial failure and recovery
- [ ] N/A — reason:

### Main files and contracts to inspect

- TODO

### Data, migration, environment, and external-service context

Name applicable defaults, persisted-state assumptions, migration or rollback
requirements, configuration, data sources, privacy limits, and environment
differences.

- TODO

## Validation

### Candidate identity and gate

- Configured exact-candidate gate command: TODO or N/A — reason
- Gate receipt for the current candidate: TODO or N/A — reason
- Receipt verification result: TODO or N/A — reason

### Automated checks

List exact commands and results. For a regression or high-risk change, identify
what failed for the intended reason before the fix and passes now.

- `command` — result and protected guarantee

### Manual and external checks

List the exact user, operator, integration, or environment flow checked. State
`Not run` and the reason when applicable.

- TODO

### Skipped proof and uncertainty

- TODO or None

## Risks / Follow-ups

### Risk after merge

State the blast radius, affected users or operators, compatibility or migration
risk, recovery path, and any remaining UX or operational caveat.

- TODO

### Follow-up or known remaining defect

- TODO or None

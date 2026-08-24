<!--
Documentation-only or mechanical pull request?
Keep Current Behavior, Commits Included, Validation, and any material Risks or
Follow-ups. Replace the remaining sections with one scoped N/A explanation.
-->

## Current Behavior

### What works today, or what scenario used to be acceptable?

Describe the existing behavior in concrete product language. Do not start with implementation details.

### What new scenario exposed the problem?

Name the workflow, data shape, user action, or integration path that makes the old behavior insufficient.

### What user-visible or product-correctness issue does this cause?

Explain what breaks, disappears, becomes misleading, corrupts data, or violates a product rule. If the impact is only internal, say why it still matters.

## Solution

### What changed?

List the actual behavioral changes. Include interfaces, APIs, migrations, compatibility behavior, and operational changes when relevant.

- TODO

### Why solve it this way instead of another way?

Name the decision owner and explain how this avoids fallback logic, duplicated rules, or future disagreement.

### How does this improve the intended architecture rather than add fragile debt?

Tie the change to the source of truth it strengthens. Call out any legacy path removed, centralized module added, or invariant protected.

## Review Focus

### Delivery tracking

For a multi-PR Project, link the Project specifications and parent issue, name the integration branch and draft integration pull request, and include the synchronized delivery view required by `_shared/engineering/multi-pr-delivery.md`.

For a child or standalone pull request, write `N/A` where appropriate and link its owning issue.

- Project:
- Product Specification:
- Technical Specification:
- Parent issue or owning issue:
- Integration branch: N/A
- Draft integration pull request: N/A
- Delivery-view synchronization evidence: N/A

### Acceptance coverage

For behavioral work, map each acceptance criterion to its distinguishing state, action, observable consequence, and test. For documentation-only or mechanical work, write `N/A` and explain why.

| Acceptance criterion | Initial state | Action or transition | Observable consequence | Discriminating test |
|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO |

For every added test or coherent parameterized group, name its distinct job. Write `N/A — no collected tests added` when applicable.

| Added test or coherent group | Protected guarantee | Primary seam | Why existing proof is insufficient |
|---|---|---|---|
| TODO or N/A | TODO or N/A | Workflow, public service, canonical rule, or operational | TODO or N/A |

### Lifecycle and integration coverage

Mark each applicable scenario, or write `N/A — <reason>`. Do not check an irrelevant box merely to complete the template.

- [ ] Fresh state
- [ ] Pre-existing state
- [ ] Later edit to the canonical owner
- [ ] Intentionally divergent linked records
- [ ] Disable, remove, or reverse the behavior
- [ ] Subsequent independent read
- [ ] Cross-child-PR producer and consumer seam
- [ ] N/A — reason:

### Main files to inspect

- TODO

### Anything intentionally out of scope

Say what this pull request does not do, especially if reviewers may expect it.

- TODO

### Data, schema, or environment context

Call out defaults, migrations, configuration, seed assumptions, external services, or environment-specific behavior.

- TODO

### Commits included

List every commit when the branch has more than one behavior-focused commit.

- TODO

## Validation

### Validated head

- Head SHA: TODO

### Test scaffolding and suite inventory

For documentation-only work with no test impact, write `N/A — <reason>`.

- Shared test infrastructure reused: TODO or N/A
- New test infrastructure introduced: No / Yes — explain why existing infrastructure could not serve the test, name its canonical owner and contract source, and identify any temporary implementation with its removal condition
- Named project command used or added for repeatable tests: TODO or N/A
- Collected test inventory changed: No / Yes — list expected additions, removals, or lane moves and the command that proves the inventory

### Automated checks

For behavioral fixes, cite the discriminating test: what failed before and passes now. Do not list only broad green suites.

- `command` — result and what it proves

### Manual checks

List the exact user or operator flows checked, or say `Not run` and explain why.

- TODO

### Local application or API verification, if relevant

Include local walkthroughs only when they add coverage beyond automated tests.

- TODO

## Risks / Follow-ups

### Risk after merge

State the blast radius and who can encounter it. Include compatibility breaks, schema migrations, configuration gates, and UX caveats.

- TODO

### Follow-up work, context change, or known remaining defect

Track deferred work explicitly. If a future slice is intentionally out of scope, name it.

- TODO

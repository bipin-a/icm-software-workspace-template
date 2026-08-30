# Repository safeguards

These safeguards are repository-wide protections against recurring failure
classes. Read only the sections relevant to the work. Current human
instructions and accepted Project specifications take precedence.

Principles express preferred direction. Safeguards state what work must not
break. Workflow contracts own procedures, and Project specifications own
outcome-specific intent and acceptance. A live safeguard includes its reason so
it can be applied without loading historical evidence.

## Scope and decisions

### RULE-PLAN-APPROVAL — Pause when authority is missing or risk is material

Proceed without another approval round-trip when the requested outcome and
authority are clear. Pause when a missing product or architecture decision
would materially change the result, or before high-risk work involving
meaningful deletion, migration, authentication or isolation, deployment,
public contracts, destructive behavior, or canonical domain ownership. State
the goal, observable definition of done, facts, assumptions, recommendation,
risks, and the specific decision needed.

Why: apparently narrow changes can fail when persisted state, canonical
ownership, or deployment history falls outside the approved plan.

### RULE-PLAIN-DECISIONS — Make material choices reviewable

Explain material decisions in plain language. Define needed terms, give a
concrete repository example, state what can go wrong, and ask one decision
question at a time.

Why: approval is useful only when the human can see the real choice and its
consequences.

### RULE-RELEVANCE — Keep work tied to the accepted outcome

Re-read the goal before acting and before completion. Report unrelated defects
separately; do not fix them without authorization.

Why: unrelated cleanup expands risk and makes the accepted result harder to
review or revert.

### RULE-WORKTREES — Isolate independent streams

Use separate worktrees only for independent parallel streams. Record branch,
base, owner, scope, dependencies, and overlap. Preserve dirty state and do not
overlap canonical-owner changes without an integration plan.

Why: shared or overlapping work can silently mix unrelated changes and
invalidate review evidence.

### RULE-ARCHITECTURE-DIRECTION — Deepen only the seam the outcome needs

Deliver the smallest observable slice that preserves accepted canonical
decisions. Repair only the seam the outcome needs and report broader debt
separately.

Why: speculative guards and broad refactors add complexity without protecting a
demonstrated product workflow.

## Canonical decisions and data meaning

### RULE-SOURCE — Keep one owner for each decision

One mechanism owns each decision. Callers adapt their local inputs to that owner
and must not add parallel fallback, alias, naming, or heuristic decisions that
can disagree with it.

Why: two mechanisms that answer the same question can each appear correct while
producing different behavior for the same state.

### RULE-CALLER-MEANING — Preserve the meaning of every caller

Before replacing duplicated logic, classify every caller's input shape, data
completeness, candidate set, and decision context. Preserve differences between
full-domain and presentation-filtered inputs, and test adapters that bridge
them.

Why: mechanically sharing a function can change behavior when callers provide
different subsets or interpret the result differently.

### RULE-NO-INFERENCE — Do not create a second decision path

A fallback, default map, naming convention, environment guess, alias, or local
branch is another decision path. Name its canonical owner, prove it cannot
disagree, and add a bypass or removal test when it is part of a behavioral
contract. Environment facts come from explicit configuration.

Why: inferred state can bypass explicit configuration while appearing to work
in narrow tests.

### RULE-REPLACE-FIRST — Inspect existing paths before adding one

Before adding a mechanism, find its callers and determine whether the work
should replace and migrate an existing path.

Why: adding beside an existing owner creates disagreement and makes later
removal harder.

### RULE-REMOVE-LEGACY — Remove replaced paths deliberately

Remove a replaced path in the same change unless a live consumer and an exact
deletion condition or date are documented. New fields and surfaces ship with
one name, never speculative aliases.

Why: an unowned compatibility path can outlive its consumer and become a second
contract.

### RULE-MEANINGFUL-DELETION — Approve removal of material protection

Obtain human approval before deleting behavior, contracts, safety, operations,
compatibility, safeguards, or documented decisions. Behavior-preserving
mechanical cleanup does not require separate approval.

Why: deletion can remove an operational or product contract even when the code
change looks mechanical.

### RULE-CONTRADICTIONS — Surface disagreement instead of choosing silently

Report contradictions between names, documentation, domain definitions,
specifications, persisted state, configuration, and behavior. Do not silently
choose between sources or functions that answer the same question differently.

Why: a plausible silent choice can hide an additional decision and make unsafe
behavior look intentional.

### RULE-CORRUPT-STATE — Preserve canonical ownership during repair

When persisted state contradicts a canonical owner, surface the affected state
through an existing audit or coverage surface, keep valid state usable, and
require explicit correction. Do not guess, auto-rewrite ambiguity, create a
second allowlist, or build a one-off repair model. Migrate only when an approved
deterministic mapping exists.

Why: guessed repair can hide corruption while creating a competing vocabulary
or decision model.

## Deployment and data safety

### RULE-MIGRATION-OBJECT-PARITY — Preserve dependent objects across rebuilds

Before rebuilding or replacing a persisted structure, inventory its dependent
constraints, indexes, triggers, views, policies, and other objects, including
objects whose definitions reference it from elsewhere. Preserve each object
under the same name or an explicitly named successor. Exercise the historical
migration path as well as fresh-schema creation.

Why: a fresh schema can pass while an upgrade path silently drops protection or
behavior attached to an older object.

### RULE-DEPLOYMENT-CONFIG — Use one explicit deployment target owner

Before a remote write, resolve and validate the complete target from the
repository's configured deployment owner. Do not infer environment, account,
region, host, data store, or credentials from unrelated values. Keep secrets out
of the repository. After deployment, verify the intended source, target,
runtime configuration, and live artifact—not only reachability.

Why: an inferred or partially resolved target can deploy the right code to the
wrong environment or pair it with incompatible state.

## Validation

### RULE-DISCRIMINATING-TESTS — Prove the intended failure and fix

For a regression fix or high-risk behavioral change, agree on the public
boundary, run a test that fails for the intended reason, then make it pass. Its
setup must distinguish the defect, and removing or bypassing the fix must fail
it. For an ordinary feature addition, fail-before evidence is optional, but
focused passing proof must still satisfy `RULE-TEST-VALUE`. Mechanical and
documentation-only work may mark behavioral proof not applicable.

Why: a test can pass without the fix when its fixture omits the decisive state
or an unrelated guard intercepts the case first.

### RULE-TEST-VALUE — Admit tests only for a credible guarantee

Every added test, or coherent parameterized group, names the acceptance
criterion, escaped defect, or material risk it protects and its primary
workflow, public-service, canonical-rule, migration, adapter, or operational
seam. Establish a credible occurrence path from the product workflow or an
actual external boundary. Check existing proof first and add another test only
for a distinct guarantee, adapter, environment, or lifecycle state. Test count
and test-line count are not success measures.

Why: broad inventories of theoretical paths can add maintenance while missing
the state that distinguishes a real defect.

### RULE-PUBLIC-CONTRACT — Cross the real integration boundary

Regression proof for a module, route, browser, service, storage, or deployment
handoff crosses the real producer, transport, consumer, and observable result.
Helper and mocked tests supplement it. Isolate security tests so the intended
guard—not an unrelated earlier check—rejects the input.

Why: isolated proof can miss broken persisted-state transitions, response
provenance, deployment identity, and boundary guards.

### RULE-CONSEQUENCE-TESTS — Test the next observable consequence

Test what a user or operator can observe on the next read or action. Do not pin
incidental wording, serialized shape, query text, or helper output unless that
detail is the contract. Keep service-boundary proof for security, isolation,
ownership, destructive actions, and persistence.

Why: a successful response does not by itself prove that the intended state or
next workflow action changed.

## Delivery integrity

### RULE-NO-SCAFFOLD — Do not commit incomplete policy or surfaces

Do not commit stubs, placeholders, or half-finished policy. Complete the
requested surface or report that it cannot be completed.

Why: partial scaffolding can appear authoritative before it can be used safely.

### RULE-DIFF-TRUTH — Derive delivery reports from repository evidence

Derive delivery reports from the complete base-to-head history and diff.
Summarize every material behavioral change, name the exact comparison base and
head, and report exact validation commands and results. Let GitHub own its live
commit inventory; do not hand-copy changing state into another owner.

Why: a technically true summary can still mislead when it omits other included
work or duplicates live state that later changes.

### RULE-REVIEWABLE-COMMITS — Keep changes understandable and reversible

Keep commits focused, independently understandable, and revertable where
practical, with relevant tests beside implementation. Do not mix unrelated
changes or add an agent or automation tool as co-author.

Why: focused history makes review, integration, diagnosis, and rollback more
reliable.

### RULE-WHOLE-TRUTH — Report material intermediate state

Scope claims so they cannot mislead. Report omissions, skipped tests,
assumptions, inconvenient commits, and meaningful intermediate state when one
step can complete before another fails.

Why: partial success can destroy retry state or leave code, Git, or deployment
state different from what a summary implies.

### RULE-INTEGRATION-DELIVERY — Separate Project authority from GitHub state

Project specifications own intent, product and technical decisions, and the
complete acceptance contract. GitHub owns live delivery state: priority,
dependencies, implementation issues and pull requests, merge order, checks,
release gates, and current status. A multi-PR Project uses one draft integration
pull request and one derived delivery view synchronized to the integration pull
request and parent delivery issue. Do not hand-maintain live GitHub state in
Project files or copy the Project acceptance contract into GitHub as a second
owner.

Why: separating stable intent from changing delivery state prevents either copy
from becoming stale or authoritative for the wrong decision.

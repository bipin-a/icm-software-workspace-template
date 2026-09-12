# Repository safeguards

Repository-wide protections against known failures. Read only relevant sections.

| Source | Owns |
|---|---|
| Current human instructions and accepted Project decisions | Take precedence over these safeguards |
| [Domain files](../domain/CONTEXT.md) | Product language and meaning |
| Principles | Preferred direction |
| Safeguards | What work must not break |
| Workflow contracts | Procedures |
| Project decisions | Outcome-specific intent and acceptance |

Historical lessons supply evidence only. Each live safeguard includes its
reason here; agents do not need a separate archive to apply it.

## Scope and decisions

### RULE-PLAN-APPROVAL — Pause when authority is missing or risk is material

- Proceed without another approval round-trip when the requested outcome and authority
  are clear.
- Pause when a missing product or architecture decision would materially change the
  result, or before high-risk work involving meaningful deletion, migration,
  authentication or account isolation, deployment, public contracts, destructive
  behavior, or canonical domain ownership.

For substantial investigation, follow the approval, effort, and stopping boundary
in [Decision work](decision-work.md#investigation-limit). Routine inspection
proceeds within scope. Unrelated work needs its own authority.

**Why:** narrow plans have overlooked persisted state, ownership, and deployment history.

### RULE-PLAIN-DECISIONS — Make material choices reviewable

Explain material decisions in plain language. Define needed terms, give a
concrete repository example, state what can go wrong, and ask one decision
question at a time.

**Why:** an approval is only useful when the human can see the real choice and its
consequences.

### RULE-AGENT-PRESENTED-APPROVAL — Present the exact decision before approval

Raise material choices and changes in chat before dependent work. Routine
choices within accepted authority need explanation, not repeated permission.

**Current feature work**

- For `feature-work`, use [Review of living decisions](document-review.md).
- That file owns review sources and revision comparison without receipt files.

**Why:** files hid material trade-offs.

### RULE-RELEVANCE — Keep work tied to the accepted outcome

Re-read the goal before acting and before completion. Report unrelated defects
separately; do not fix them without authorization.

**Why:** unrelated cleanup expands risk and makes the accepted result harder to
review or revert.

### RULE-WORKTREES — Isolate independent streams

- Use a dedicated branch for a Project; create additional worktrees only for
  independent parallel streams or the configured full candidate gate.
- Record branch, base, owner, scope, dependencies, and overlap.
- Preserve dirty state and do not overlap canonical-owner changes without an integration
  plan.
- Before substantial edits or long commands, report the worktree location, branch,
  status, and worktree list.

**Why:** shared or overlapping worktrees can silently mix unrelated changes and
invalidate review evidence.

### RULE-ARCHITECTURE-DIRECTION — Deepen only the seam the outcome needs

Deliver the smallest user-visible slice that preserves accepted canonical
decisions. Repair only the seam the outcome needs and report broader debt
separately.

**Why:** speculative guards and broad refactors add complexity without protecting a
real product workflow.

## Canonical decisions and domain meaning

### RULE-SOURCE — Keep one owner for each decision

One mechanism owns each decision. Callers adapt local data shapes to that owner;
they do not add competing fallback, name-based, or heuristic interpretations.

**Why:** duplicate predicates can disagree while each appears locally correct.

### RULE-CALLER-MEANING — Preserve the meaning of every caller

Before replacing duplicated logic, classify every caller's row shape, data
completeness, candidate set, and decision context. Preserve the difference
between full-domain inputs and presentation-filtered inputs, and test the
adapters that bridge them.

**Why:** a presentation-filtered list may omit data required by a domain decision.

### RULE-NO-INFERENCE — Do not create a second decision path

- A fallback, default map, naming convention, environment guess, alias, or local branch
  is another decision path.
- Name its canonical owner, prove it cannot disagree, and add a bypass or removal test
  when it is part of a behavioral contract.
- Environment facts come from explicit configuration.

**Why:** inferred hostnames and inherited deployment coordinates have bypassed
explicit configuration while appearing to work in tests.

### RULE-REPLACE-FIRST — Inspect existing paths before adding one

Before adding a mechanism, find every caller and determine whether the work
should replace and migrate an existing path.

**Why:** adding beside an existing owner creates disagreement and makes later
removal harder.

### RULE-REMOVE-LEGACY — Remove replaced paths deliberately

Remove a replaced path in the same change unless a live consumer and an exact
deletion condition or date are documented. New fields and surfaces ship with
one name, never aliases.

**Why:** a new API payload once shipped with two names even though no live consumer
required compatibility.

### RULE-MEANINGFUL-DELETION — Approve removal of material protection

Obtain human approval before deleting behavior, contracts, safety, operations,
compatibility, safeguards, or documented decisions. Behavior-preserving
mechanical cleanup does not require a separate approval.

**Why:** deletion can remove an operational or product contract even when the code
change looks mechanical.

### RULE-CONTRADICTIONS — Surface disagreement instead of choosing silently

Report contradictions between names, documentation, domain definitions,
specifications, persisted state, and behavior. Do not silently choose between
definitions or functions that answer the same question differently.

**Why:** misleading function names, response provenance, and operator commands have
hidden additional decisions and unsafe behavior.

### RULE-CORRUPT-STATE — Preserve canonical ownership during repair

- When persisted rows contradict a canonical owner, surface the bad rows through the
  existing audit or coverage surface, keep valid rows usable, and require explicit
  correction.
- Do not guess, auto-rewrite ambiguity, create a second allowlist, or build a one-off
  repair model.
- Migrate only when an approved deterministic mapping exists.

**Why:** one corrupt row has disabled valid coverage, while guessed repair models
would have created a competing vocabulary.

## Deployment and data safety

### RULE-MIGRATION-OBJECT-PARITY — Preserve dependent state across migrations

Before a schema or ownership migration, inventory dependent objects, consumers,
and historical data. Preserve each under its existing owner or an explicitly
accepted successor. Prove the upgrade from representative pre-existing state;
a fresh schema alone does not establish migration safety.

**Why:** rebuilds can silently drop constraints or dependent objects.

### RULE-DEPLOYMENT-CONFIG — Use one explicit deployment owner

Follow the [release procedure](../../workflows/06_release/references/release-rules.md).
Resolve the exact environment and target from explicit configuration before a
remote write. Keep secrets outside the repository. Verify the deployed source,
configuration, and behavior after the write.

**Why:** inferred targets and stale source identities can change the wrong environment.

## Validation

### RULE-DISCRIMINATING-TESTS — Prove the intended failure and fix

- For a regression fix or high-risk behavioral change, agree on the public boundary, run
  a test that fails for the intended reason, then make it pass.
- Its setup must distinguish the defect, and removing the fix must fail it.
- Contract guards require a bypass or removal test.
- For an ordinary feature addition, fail-before evidence is optional, but focused
  passing proof must still satisfy `RULE-TEST-VALUE`.
- Mechanical and documentation-only work may mark behavioral proof not applicable.

**Why:** tests have passed without the fix when fixtures omitted the decisive state,
supplied only accepted security inputs, or checked only a fresh schema.

### RULE-TEST-VALUE — Admit tests only for a credible guarantee

- Every added test, or coherent parameterized group, must name the acceptance criterion,
  escaped defect, or material risk it protects and its primary workflow, public-service,
  canonical-rule, or operational seam.
- Establish a credible occurrence path from the product workflow or an actual external
  boundary; theoretical possibility alone does not justify a test.
- Check existing proof first and add another test only for a distinct guarantee,
  adapter, environment, or lifecycle state.
- Helper, SQL-shape, private-DOM, snapshot, and mock-only assertions are primary proof
  only when that detail is itself the contract; otherwise they supplement consequence
  proof.
- Test count and test-line count are not success measures.

**Why:** broad happy-path and unhappy-path inventories can over-engineer risks that
the product cannot reach while still missing the one state that distinguishes a
real defect.

### RULE-PUBLIC-CONTRACT — Cross the real integration boundary

- Regression proof for a module, route, browser, service, storage, or deployment handoff
  crosses the real producer, transport, consumer, and observable result.
- Helper and mocked tests supplement it.
- Isolate a security test so the intended guard—not an unrelated earlier check—rejects
  the input.

**Why:** isolated tests have missed broken persisted-state transitions, incorrect
response provenance, deployment identity, and security guards.

### RULE-CONSEQUENCE-TESTS — Test the next observable consequence

- Test what an operator or customer can observe on the next read.
- Do not pin incidental wording, JSON shape, or helper output unless it is the contract.
- Keep API or service proof for security, account boundaries, ownership, destructive
  actions, and persistence.

**Why:** a successful delete response once failed to prove that the interface
removed the item and action on the next read.

## Delivery integrity

### RULE-NO-SCAFFOLD — Do not commit incomplete policy or surfaces

Do not commit stubs, placeholders, or half-finished implementation or policy.
Blank setup prompts and optional artifact starters are intentional template
inputs; remove their prompts when instantiating decisions. Complete the
requested surface or report that it cannot be completed.

**Why:** partial scaffolding creates a path that appears authoritative before it can
be used safely.

### RULE-DIFF-TRUTH — Derive delivery reports from repository evidence

- Derive delivery reports from `git log` and the complete base-to-head `git diff`.
- Summarize every material behavioral change, name the exact comparison base and head,
  and report exact validation commands and results.
- GitHub's commit view owns the commit inventory; do not hand-copy it into the PR body.
- Build PR descriptions from the configured template and repository evidence.
- Use the configured GitHub delivery adapter rather than assuming unsupported command
  flags preserve content.

**Why:** a technically true push report once omitted other included work, while a
hand-copied commit list duplicates GitHub state and can become stale.

### RULE-REVIEWABLE-COMMITS — Keep changes understandable and reversible

Keep commits focused, independently understandable, and revertable where
practical, with relevant tests beside implementation. Do not mix unrelated
changes. Never add an agent or automation tool as co-author.

**Why:** focused history makes review, integration, diagnosis, and rollback more
reliable.

### RULE-WHOLE-TRUTH — Report material intermediate state

Scope claims so they cannot mislead. Report omissions, skipped tests,
assumptions, inconvenient commits, and meaningful intermediate state when one
step can commit before another fails.

**Why:** partial success has destroyed retry state, hidden commits, and left code or
deployment state different from what a summary implied.

### RULE-INTEGRATION-DELIVERY — Separate Project authority from GitHub state

- Project decisions own intent, product and technical decisions, and the complete
  acceptance contract.
- GitHub owns live delivery state: priority, dependencies, implementation issues and
  PRs, merge order, checks, release gates, and current status.
- A multi-PR Project follows [multi-PR delivery](multi-pr-delivery.md). Any
  delivery view derives from live metadata and creates no second state owner.
- Do not hand-maintain live GitHub state in Project files or copy the Project acceptance
  contract into GitHub as a second owner.

**Why:** separating stable intent from changing delivery state prevents either copy
from silently becoming stale or authoritative for the wrong decision.

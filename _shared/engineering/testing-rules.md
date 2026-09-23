# Testing rules

This file owns the repeatable method for proving the repository's behavior
efficiently. The mandatory guarantees live under the Validation section of
[`safeguards.md`](safeguards.md); Project decisions own outcome-specific
acceptance and may require stricter proof.

## Earn each test

A test or coherent parameterized group is earned when it protects:

- an accepted Project criterion;
- a defect that could return; or
- a material technical or product risk with a credible occurrence path.

- Check existing proof first when adding, changing, or reviewing tests.
- Extend the owning suite or parameterized group when it can prove the missing
  guarantee.
- Consolidate duplicate coverage while preserving distinct guarantees.
- Do not add a test merely to enumerate every happy or unhappy path, increase a count,
  or protect a theoretical state that the product workflow and its actual boundaries
  cannot reach.

Name the protected guarantee, the distinguishing state, and the primary seam:
workflow, public service, canonical rule, migration, adapter, or operation. One
parameterized group should own repeated cases that protect the same guarantee.

## Prove the right cause at a stable boundary

- Test public behavior or the next observable consequence, not only how the
  implementation produces it.
- Make the fixture distinguish the protected defect or risk. The test must fail
  for the intended reason when that guarantee is broken.
- For a regression or high-risk behavioral change, prove the failure first and
  then the fix. Removing or bypassing the fix must make the proof fail.
- For an ordinary feature addition, fail-before evidence is optional unless the
  Project decision requires it.
- Use focused rule, migration, race, failure-injection, or adapter tests when
  that seam proves the guarantee more directly than a browser workflow.
- Let helper, SQL-shape, private-DOM, snapshot, and mock-only assertions
  supplement consequence proof unless that implementation detail is itself the
  contract.
- Keep security, account-boundary, ownership, destructive-action, and persistence
  proof at the API or service boundary that owns the consequence.

- A valuable test stays green through a safe refactor and turns red when its named
  guarantee is broken.
- Update it when the contract changes or the test was wrong, not merely because the
  implementation changed.

## Use the efficient proof sequence

1. Read the acceptance criterion and identify the exact candidate being tested.
2. Check whether current tests already protect the guarantee and lifecycle
   state.
3. Choose the narrowest meaningful boundary that proves the observable result.
4. For a regression or high-risk change, run the discriminating failure before
   implementation.
5. Run the focused proof first, then the wider repository checks required by the
   Project and risk.
6. Record exact commands, candidate identity, results, failures, and skipped
   proof.

Documentation-only, formatting-only, and behavior-preserving mechanical work
may record behavioral testing as not applicable. Structural checks should still
prove the intended document or migration relationship.

Choose proof from the actual diff, acceptance, and risk; record the commands and
scope reason in the existing PR or validation handoff. No separate plan file.

| Change | Required proof |
|---|---|
| Prose, artifact, or mechanical edit | Relevant structure/link/revision checks; behavioral proof may be N/A |
| Workflow, checker, or test tooling | Focused contract/tool regression tests; no application browser gate by default |
| Bounded application behavior | Affected behavior and integration seam; browser proof only for a browser obligation |
| Broad runtime integration or an explicit full-gate obligation | Complete integration gate after focused proof |

- On a later edit, inspect the diff from the tested revision and rerun affected proof
  only.
- Keep the original tested identity and state why other evidence still applies.
- A new commit alone does not erase evidence.
- Report unrelated baseline failures separately; do not repair them or repeat suites
  without a demonstrated connection to this change.

## Reuse test infrastructure without centralizing scenarios

Before adding, changing, or reviewing tests:

1. inspect nearby tests and `tests/` for the owning suite, existing coverage,
   shared setup, assertion helpers, and execution conventions;
2. reuse suitable database doubles, application-environment builders, account
   factories, server harnesses, and assertion helpers through their existing
   extension points;
3. keep distinguishing scenario data local and deliberate overrides explicit
   where the test makes them; and
4. if an existing owner cannot prove the intended behavior, identify the concrete
   mismatch and make the smallest necessary extension or separate setup. Explain
   that choice in the test or existing PR, without a separate artifact.

During review, check these relationships against the existing suite. A passing
test does not justify duplicated infrastructure or a parallel test convention.

- A helper inside another collected spec is not automatically shared.
- If several tests would otherwise implement the same infrastructure decision
  differently, create one repository-level owner with named extension points.
- Do not force unrelated scenario data into a universal fixture merely to remove
  repetition.

Named `package.json` scripts own repeatable command composition. Documentation,
CI, tickets, and agents should invoke those scripts rather than create a second
set of runner flags or lane definitions.

## Consider lifecycle states only when relevant

Choose the states needed by the criterion and credible risk, which may include:

- create or first use;
- existing persisted data or returning use;
- change, reverse, or undo;
- disable, remove, or retire;
- reload or restart;
- divergence between linked records;
- corruption with valid neighboring rows;
- account isolation; or
- partial failure and recovery.

- This is a prompt for specification and review, not a requirement to test every state
  for every feature.
- An empty-state fixture does not prove a criterion about existing incompatible data,
  and identical linked records do not prove data provenance.

## Progress evidence through environments

Use this default sequence unless an approved Project brief defines a
stricter path:

1. Test the exact candidate locally with focused proof, then run the wider
   required checks.
2. When the Project requires non-production proof, deploy that exact candidate
   to the named environment and validate the applicable integration and user
   flows there.
3. If evidence requires a code or specification change, create a new candidate
   and repeat the affected proof.
4. Treat non-production success as readiness evidence, not production
   authorization.
5. Release only after readiness approves the exact candidate and the human
   authorizes the external change; then verify production and the remaining
   monitoring or rollback obligations.

Name the real environments in the Project Project brief. Labels such
as dev, preview, and staging do not prove equivalent infrastructure.

- For material evidence, identify the environment, data source and type, and dataset
  version or baseline.
- Prefer deterministic, resettable fixtures when repeatability matters.
- Synthetic, mock, fixture, or anonymized data proves only the relationships it
  represents; report important differences from production.
- Never copy production secrets or personal data into non-production without an explicit
  approved privacy and security design.

## Local browser-test safety

- When Playwright or another browser test is part of the selected proof, follow the
  canonical [local browser-test environment
  procedure](local-browser-test-environment.md).
- Load it only for browser testing; it owns candidate-server provenance and the safe
  reuse of existing servers.

## Focused repository commands

The application has no selected stack or proof commands in the source template.
Before its first implementation needs executable proof, define and verify the
focused and full commands in its native executable configuration. Record the
command names and applicability here; do not invent an application gate during setup.

ICM tooling uses the commands under `tools/icm/package.json`:

- `npm --prefix tools/icm run check` — whole workspace structure and local links.
- `npm --prefix tools/icm run check -- --project <slug>` — one living brief and
  its declared decision documents.
- `npm --prefix tools/icm test` — the workspace tooling's contract tests.
- `npm --prefix tools/icm run context -- <files...>` — explicit-file size estimate.

## ICM artifact validation

For a brief edit, use the selected-Project check. Follow
[document review](document-review.md) when comparing a reviewed commit.
For shared workflow, template, or checker changes, run the workspace check and
relevant tooling tests. A structural pass cannot establish approval or judgment.
Context-size overages warn; missing decisions and broken references fail.

## Worktree dependency bootstrap

Use the active worktree's lockfile and native package manager's reproducible
install command when dependency-backed proof needs an install. Do not borrow or
symlink another worktree's installed dependencies. This template's ICM tools
use Node.js built-ins and require no dependency installation.

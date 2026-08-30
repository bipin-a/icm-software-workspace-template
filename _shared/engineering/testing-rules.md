# Testing rules

This file owns the repeatable method for proving repository behavior
efficiently. Mandatory guarantees live under Validation in
[`safeguards.md`](safeguards.md); Project specifications own outcome-specific
acceptance and may require stricter proof.

## Earn each test

A test or coherent parameterized group is earned when it protects:

- an accepted Project criterion;
- a defect that could return; or
- a material technical or product risk with a credible occurrence path.

Check existing proof first. Do not add a test merely to enumerate every happy
or unhappy path, increase a count, or protect a theoretical state that the
product workflow and its actual boundaries cannot reach.

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
  Project specification requires it.
- Use focused rule, migration, race, failure-injection, or adapter tests when
  that seam proves the guarantee more directly than a browser workflow.
- Let helper, query-shape, private-interface, snapshot, and mock-only assertions
  supplement consequence proof unless that detail is itself the contract.
- Keep security, isolation, ownership, destructive-action, and persistence
  proof at the service boundary that owns the consequence.

A valuable test stays green through a safe refactor and turns red when its named
guarantee is broken. Update it when the contract changes or the test was wrong,
not merely because the implementation changed.

## Use the efficient proof sequence

1. Read the acceptance criterion and identify the exact candidate being tested.
2. Check whether current tests already protect the guarantee and lifecycle
   state.
3. Choose the narrowest meaningful boundary that proves the observable result.
4. For a regression or high-risk change, run the discriminating failure before
   implementation.
5. Run focused proof first, then the wider checks required by the Project and
   risk.
6. Record exact commands, candidate identity, results, failures, and skipped
   proof.

Documentation-only, formatting-only, and behavior-preserving mechanical work
may record behavioral testing as not applicable. Structural checks should still
prove the intended document, link, or migration relationship.

## Reuse test infrastructure without centralizing scenarios

Before adding a database double, application-environment builder, account or
tenant factory, server harness, or other reusable infrastructure behavior:

1. search the test tree and nearby specifications for an existing shared owner;
2. name the infrastructure contract that owner represents;
3. reuse it and keep the distinguishing scenario data local; and
4. record a deliberate override where the test makes it.

A helper inside another collected test is not automatically shared. If several
tests would otherwise implement the same infrastructure decision differently,
create one repository-level owner with named extension points. Do not force
unrelated scenario data into a universal fixture merely to remove repetition.

Named repository scripts own repeatable command composition. Documentation,
CI, tickets, and agents invoke those scripts rather than create a second set of
runner flags or lane definitions.

## Consider lifecycle states only when relevant

Choose the states needed by the criterion and credible risk, which may include:

- create or first use;
- existing persisted data or returning use;
- change, reverse, or undo;
- disable, remove, or retire;
- reload or restart;
- divergence between linked records;
- corruption with valid neighboring state;
- isolation between accounts, tenants, or owners; or
- partial failure and recovery.

This is a prompt for specification and review, not a requirement to test every
state for every feature. An empty-state fixture does not prove a criterion about
existing incompatible data, and identical linked records do not prove data
provenance.

## Progress evidence through environments

Use this default sequence unless an approved Technical Specification defines a
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

Name real environments in the Project Technical Specification. Labels such as
development, preview, and staging do not prove equivalent infrastructure.

For material evidence, identify the environment, data source and type, and
dataset version or baseline. Prefer deterministic, resettable fixtures when
repeatability matters. Synthetic, mock, fixture, or anonymized data proves only
the relationships it represents; report important differences from production.
Never copy production secrets or personal data into non-production without an
explicit approved privacy and security design.

## Local browser-test safety

When a browser test is part of the selected proof, follow the canonical
[local browser-test environment procedure](local-browser-test-environment.md).
Load it only for browser testing; it owns candidate-server provenance and safe
reuse of existing servers.

## Repository entry commands

Executable commands are intentionally deferred until the Technical
Specification selects the stack and working test configuration exists. Before
the first candidate is handed to Validate, record stable repository-owned entry
commands here for:

- focused proof;
- full required checks;
- build or packaging; and
- the exact-candidate integration gate, when one exists.

Keep Project-specific proof requirements in the owning Technical Specification.
Do not copy runner flags into several workflow files.

Focused proof: Deferred until executable test configuration exists.

Full required checks: Deferred until executable test and CI configuration
exists.

Build or packaging: Deferred until executable build configuration exists.

Exact-candidate gate: Deferred until the repository defines one canonical
command.

## Exact-candidate integration gate

Validate the assembled candidate with the repository's one canonical complete
gate after independent review, focused criterion proof, and correction or human
disposition of candidate-invalidating findings.

The gate identifies the exact commit or immutable tree, refuses ambiguous dirty
state, and records every phase, failure, omission, and relevant environment. A
changed candidate invalidates the result. Do not describe the gate as complete
when a required phase did not run or failed.

Hosted checks may execute the same proof in separate phases, but their terminal
results must still identify the same candidate and must not be replaced by a
pasted or manually asserted success.

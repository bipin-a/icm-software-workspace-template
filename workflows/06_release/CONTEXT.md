---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Technical choices, Acceptance and proof, Links, Product behavior]
---

# 06_release — Deploy and verify one environment at a time

One job: plan, execute, verify, and decide one authorized environment change. Skip when deployment is outside the requested outcome.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the brief sections named in frontmatter and relevant linked decision owners. Bounded work needs no Project.
- The accepted candidate, configured provider procedure, selected target, existing plan and authority, and environment-specific migration, proof, recovery, and monitoring obligations. Never load credential values.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Prepare a concrete credential-free no-write plan using the configured provider procedure. Verify clean source, exact candidate and target, proposed writes, proof, recovery boundaries, and monitoring. This template supplies no deployment command, target, or mandatory environment sequence.
2. Reuse authority covering the exact plan; resolve missing material source, target, write, or recovery decisions before execution. Recheck source, target, scope, authority, and execution context immediately before writes.
3. Run the authorized procedure and record attempted, completed, failed, and partial actions with non-secret results. On failure, use only already authorized recovery or obtain the missing decision.
4. Verify actual deployed source, configuration, data, migration state, and every partial write. Reuse terminal smoke evidence for this attempt or run required checks, then prove accepted behavior using actual environment and reset constraints. Reachability alone does not prove persistence, migration, or isolation.
5. Record terminal results, production differences, failures, omissions, monitoring, and rollback limits. Decide: accept completion, plan the next environment, revise, retry, contain, roll back, or stop.
6. Continue only within the agreed environment sequence and authority. A material source, target, or write change returns to planning. Success in an earlier environment never authorizes production.

## Outputs

- PR/release surface: no-write plan and authority, deployment attempt, environment-specific proof, remaining obligations, and next route; brief Links points to them.

## Human check

Resolve missing authority for the plan, production, or a changed action. Reuse existing authority where it applies; no environment advances solely because checks passed.

## Rules

This table lists the rules this stage adds to the always-loaded set named in
`AGENTS.md` (voice, decision work, and principles); those still apply. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-AGENT-PRESENTED-APPROVAL`; `RULE-SOURCE`; `RULE-NO-INFERENCE`; `RULE-DEPLOYMENT-CONFIG`; `RULE-MIGRATION-OBJECT-PARITY`; `RULE-CONTRADICTIONS`; `RULE-WHOLE-TRUTH` |
| [`release-rules.md`](references/release-rules.md) | `Authority and boundary`; `Plan before writes`; `Execute the authorized plan`; `Verify and decide` |
| [`release-rules.md`](references/release-rules.md) | Conditional on a failed or partial deployment: `Diagnose a deployed runtime failure`; `Failure and rollback boundary` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | `Use the efficient proof sequence`; `Progress evidence through environments`; `Focused repository commands` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for browser proof: `Local browser-test safety` |
| [`github-delivery-rules.md`](../../_shared/engineering/github-delivery-rules.md) | `Traceability and human gates` |

# Validation review rules

This file owns the baseline review and conditional evidence angles for candidates
and the finding evaluation used by Project and direct reviews. Shared testing
rules and safeguards retain their own requirements.

## Baseline review

For every candidate, assess:

- conformance with accepted chat/PR decisions or the Project brief and linked owners;
- the actual base-to-head behavior and affected canonical owners;
- correctness across the credible lifecycle and integration states named by
  acceptance or material risk;
- changed tests and existing tests used as proof against the shared rules for
  [necessity](../../../_shared/engineering/testing-rules.md#earn-each-test),
  [stable behavior](../../../_shared/engineering/testing-rules.md#prove-the-right-cause-at-a-stable-boundary),
  and [repository reuse](../../../_shared/engineering/testing-rules.md#reuse-test-infrastructure-without-centralizing-scenarios);
- failure, rollback, compatibility, configuration, and operational consequences
  that are present in the accepted design; and
- contradictions, hidden fallbacks, duplicated ownership, unrelated changes,
  and skipped proof.

## Conditional angles

Add an angle only when its trigger is present:

| Trigger | Review angle |
|---|---|
| Added or changed ICM Markdown | [ICM Markdown review](#icm-markdown-review) |
| Authentication, authorization, privacy, account isolation, secrets, or destructive behavior | Security and hardening |
| Persisted data, schema, compatibility, ownership transfer, or retirement | Migration and repair |
| Material latency, load, resource, media, or cost requirement | Performance and capacity |
| Material user-interface behavior or interaction | UI, UX, accessibility, and real-browser evidence |
| Public or cross-component interface | API and contract compatibility |
| Current external framework, API, CLI, cloud, or version claim | Official-source and observed-runtime evidence |
| Multi-PR assembly or overlapping ownership | Integration and combined-diff evidence |
| Deployment, configuration, migration, rollback, or monitoring change | Operational and environment evidence |

Do not run every angle by default. A specialized review contributes evidence;
it does not change accepted decisions or grant release authority.

## ICM Markdown review

- Review added or changed ICM Markdown against
  [Write plainly](../../../_shared/voice.md#write-plainly) and
  [Keep durable context small](../../../_shared/voice.md#keep-durable-context-small).
- Flag concrete clarity problems in the existing review. Unresolved unclear text
  leaves documentation incomplete; the owning correction route revises it while
  preserving meaning and required structure.
- Structural checks verify links, routing, and templates. They do not establish
  readability; the reviewer must assess it.

## Finding format

**Check whether the finding is valid**

- Evaluate a finding before treating it as implementation work, including findings from
  another reviewer or agent.
- Establish both whether the scenario can occur and whether the product must support it.
- An existing code path alone does not settle intended support; use accepted behavior,
  the relevant domain owner, and concrete evidence.
- Resolve uncertainty through bounded inspection or a product question before choosing a
  correction.

**Record in the existing chat or PR**

- observation and evidence;
- evidence status: confirmed, uncertain, or invalid;
- a reachable workflow, credible failure path, or relevant persisted state and
  its observable consequence;
- relationship to accepted behavior, a technical contract, a safeguard, or
  explicitly out-of-scope behavior, including how this change affects it;
- credible response options and their material costs;
- recommendation to fix, investigate, seek a product decision, or dismiss,
  with reasons clearly separated from fact; and
- the human or canonical owner responsible for disposition.

**Choose the response before expanding work**

- For consequential findings, explain the scenario's validity and recommended response
  in chat before expanding the implementation.
- Apply the existing
  [Review and change](../../../_shared/engineering/document-review.md#review-and-change)
  authority rules.
- Dismiss only with evidence; unclear support remains unresolved, and retiring an
  existing obligation is a separate product decision.

Do not inflate severity to force a route. An unavailable or conflicting source
is unresolved evidence, not permission to invent an answer.

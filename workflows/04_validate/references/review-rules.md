# Validation review rules

This file owns only baseline review, conditional evidence angles, evidence
context, and finding format for Validate. Shared testing rules and safeguards
retain their own requirements.

## Baseline review

For every candidate, assess:

- each accepted criterion and its observable consequence;
- the actual base-to-head behavior and affected canonical owners;
- correctness across credible lifecycle and integration states named by
  acceptance or material risk;
- whether tests distinguish the intended guarantee at an appropriate seam;
- failure, rollback, compatibility, configuration, and operational
  consequences present in the accepted design; and
- contradictions, hidden fallbacks, duplicated ownership, unrelated changes,
  removed behavior, and skipped proof.

## Evidence context

- Record the evidence environment and whether data was synthetic, fixture,
  mock, anonymized, or production, including a dataset identifier or version
  when available.
- State what the evidence establishes and what remains unproved because of the
  environment, dataset, actors, or method.
- Local and non-production evidence can prove represented behavior and support
  human usability judgment. It does not by itself prove real-world adoption.
- Confirm that data covers the lifecycle states, relationships, and boundary
  conditions required by the specifications.

## Conditional angles

Add an angle only when its trigger occurs:

| Trigger | Review angle |
|---|---|
| Authentication, authorization, privacy, isolation, secrets, or destructive behavior | Security and hardening |
| Persisted data, schema, compatibility, ownership transfer, or retirement | Migration, repair, and removed-behavior audit |
| Material latency, load, resource, media, or cost requirement | Performance and capacity |
| Material user-interface behavior or interaction | UI, UX, accessibility, and real-browser evidence |
| Public or cross-component interface | API and contract compatibility |
| Current external framework, API, CLI, cloud, or version claim | Official-source and observed-runtime evidence |
| Multi-pull-request assembly or overlapping ownership | Integration and combined-diff evidence |
| Deployment, configuration, migration, rollback, or monitoring change | Operational and environment evidence |

Within an earned angle, check cross-file traces, language-specific pitfalls,
facade or adapter correctness, reuse and duplication, simplification,
efficiency, and alignment with the Project goal only where relevant. Do not run
every angle by default. A specialized review contributes evidence; it does not
change specifications or make the readiness decision.

## Finding format

Record:

- observation and exact evidence;
- evidence status: confirmed, uncertain, or invalid;
- relationship to an acceptance criterion, technical contract, safeguard, or
  explicitly out-of-scope behavior;
- impact and why it may matter;
- one concrete occurrence or consequence;
- credible response options and their material costs;
- recommendation, clearly separated from fact; and
- the human or canonical owner responsible for disposition.

Do not inflate severity to force a route. An unavailable or conflicting source
is unresolved evidence, not permission to invent an answer. Validation reports;
it does not repair or dispose of a finding.

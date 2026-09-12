# Release rules

## Authority and boundary

Use only for a requested release. Accepted decisions in the brief/PR own
migration, rollback, monitoring, and proof obligations. Before the first release,
configure and link one provider procedure and its explicit environment targets
here. This source template has no provider, deployment command, or live target.
Read current environment and database state from their owners. Keep secrets out
of artifacts and evidence. Local work is complete without deployment when that
is the requested scope.

## Plan before writes

Prepare a credential-free, no-write plan for the exact source, environment,
target, proposed writes, migrations, verification, rollback, and monitoring.
Use existing authority when it covers that concrete action; resolve missing
release authority before writes. Changed material scope needs renewed authority.

## Execute the authorized plan

Recheck source, target, authorization, and execution context immediately before
the write. Use the configured executor; do not infer targets or broaden commands.
Record completed and partial writes and the last attempted action. On failure,
apply only recovery already authorized by the plan, or obtain the missing
recovery decision. Do not silently retry or promote after partial failure.

## Verify and decide

Verify deployed source identity, configuration, and each required behavior
against the intended environment and data state. Reachability alone is
insufficient. Record failures, skipped proof, monitoring, and rollback limits.
Advance only within the accepted environment sequence and authority. Otherwise
report the concrete choice: accept, revise, retry, contain, roll back, or stop.
Non-production success does not authorize production.

# Release rules

## Authority and boundary

Use only for a requested release. Accepted decisions in the brief/PR own
migration, rollback, monitoring, and proof obligations. Before the first release,
configure and link one provider procedure and its explicit environment targets
here. This source template has no provider, deployment command, or live target.
Read current environment and database state from their owners. Keep secrets out
of artifacts and evidence. Local work is complete without deployment when that
is the requested scope.

Use the environment sequence required by the accepted task and repository
policy. Example or inherited environment rows do not create deployment gates.
Resolve exact targets from the configured owner; do not infer them from a
branch name or copy another project's default sequence.

## Plan before writes

Prepare a credential-free, no-write plan for the exact source, environment,
target, proposed writes, migrations, verification, rollback, and monitoring.
Use existing authority when it covers that concrete action; resolve missing
release authority before writes. Changed material scope needs renewed authority.

Verify the clean source context and exact accepted revision. Use the configured
procedure's trustworthy plan or read-only inspection path and confirm it
performs no remote writes. Missing configuration, a mixed target, dirty source,
or unexplained plan output must be resolved before execution.

## Execute the authorized plan

Recheck source, target, authorization, and execution context immediately before
the write. Use the configured executor; do not infer targets or broaden commands.
Record completed and partial writes and the last attempted action. On failure,
apply only recovery already authorized by the plan, or obtain the missing
recovery decision. Do not silently retry or promote after partial failure.
Follow the [failure and rollback boundary](#failure-and-rollback-boundary) when
observed state differs from the plan.

## Verify and decide

Verify deployed source identity, configuration, and each required behavior
against the intended environment and data state. Reachability alone is
insufficient. Record failures, skipped proof, monitoring, and rollback limits.
Advance only within the accepted environment sequence and authority. Otherwise
report the concrete choice: accept, revise, retry, contain, roll back, or stop.
Non-production success does not authorize production.

Reuse applicable smoke evidence for the same deployment attempt. Run missing
required routing checks and the accepted behavioral proof against the exact
deployed targets. Keep local-server evidence distinct from deployed evidence.

## Diagnose a deployed runtime failure

Use the configured provider's stored logs for the named environment and
incident window before requiring a fresh reproduction. Reuse a supplied
window; resolve a missing target or window before querying. Correlate events
with deployment, source, request, and trace identities when available.

Report retention, sampling, permission, truncation, and filter limits. An empty
result does not establish that the failure never happened. A live stream does
not recover earlier events. Reproduction and live observation need their own
applicable scope and authority; do not infer an unrelated browser cause.

## Failure and rollback boundary

Record prior deployment identities and inspect actual writes before selecting
recovery. Application rollback does not necessarily reverse data migrations or
external side effects. Check cross-component compatibility before reverting
only one component.

Use the accepted rollback design and observed recovery targets. If the design
is missing or no longer fits the partial writes, report the state and resolve
the containment or recovery decision with its owner. Preserve completed,
failed, and unattempted actions separately; a failed deployment cannot advance
to another environment merely because some writes succeeded.

# Release rules

## Authority and boundary

- Release acts only on the exact candidate accepted by Assess Readiness.
- The Technical Specification names the Project's environments and owns
  migration, rollback, monitoring, and required proof. The configured
  deployment procedure maps those names to executable targets and commands.
- Live deployment, environment, database, and monitoring state must be read
  from their current owners. Do not copy an old summary as current state.
- Credentials and secret values remain outside Project artifacts and evidence.

## Plan before writes

- Prepare one credential-free no-write plan for one candidate and environment.
- Pin source, target, proposed writes, migrations, proof, rollback, and
  monitoring obligations.
- Human authorization applies only to that exact plan. A changed source, target,
  environment, or action requires a new plan and authorization.

## Execute the authorized plan

- Reconfirm source, target, plan identity, authorization, and clean execution
  context immediately before the first write.
- Use the configured executor or provider procedure. Do not reconstruct,
  reorder, or broaden its remote-write commands.
- Record every completed or partial write and the last attempted action.
- A partial or failed deployment is an incident state, not permission to retry,
  repair, roll back, or promote automatically.

## Verify and decide

- Verify routing and each required deployed criterion or risk against the exact
  deployed source, environment, target, and data state.
- Reachability alone does not prove behavior, persistence, migration,
  authentication, isolation, media, or another accepted contract.
- Record what each check proves, failures, skipped proof, monitoring, and
  rollback constraints.
- After terminal evidence, a human chooses exactly one route: next environment,
  new plan and retry, approved containment or rollback, an earlier workflow
  stage, or stop after production acceptance.

## Human check

Every environment requires its own reviewed plan, explicit authorization,
terminal verification, and decision. No environment advances automatically.

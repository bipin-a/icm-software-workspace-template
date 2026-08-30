# ICM software workspace

Current human instructions and accepted Project artifacts take precedence. This
repository is an unconfigured factory until `setup/questionnaire.md` is
complete.

## Start here

1. When maintaining the reusable template itself, read `README.md` and
   `_shared/methodology/interpretable-context-methodology.md`; leave the setup
   questionnaire incomplete.
2. In an instantiated repository, read `setup/questionnaire.md`. If its status
   is not `complete`, use only `setup/CONTEXT.md` until the factory is approved.
3. Read `CONTEXT.md` and select one exact route.
4. For Project work, select one `projects/<project-slug>/PROJECT.md`, then use
   `workflows/CONTEXT.md` to identify the earliest applicable stage.
5. Load only the selected working contract, its named Project artifacts, and
   the exact shared references selected by that contract.

Follow `_shared/voice.md` for human-facing and repository-facing communication.
For workflow, routing, or workspace-structure changes, also read
`_shared/methodology/interpretable-context-methodology.md`.

## Always

- Keep one canonical owner for each decision. Link to it instead of copying it.
- Treat Project files as durable context and accepted intent. Read changing
  pull-request, check, approval, and deployment state from the external system
  that owns it.
- Do not infer approval from a file, link, green check, branch name, or deployed
  resource. Use the configured approval contract and exact artifact identity.
- Preserve unrelated changes and inspect repository state before editing.
- Do not commit secrets, placeholders, stubs, or half-finished policy.
- Report contradictions and assumptions instead of silently choosing an answer.
- Pause when authority is missing or a change is materially destructive,
  public, security-sensitive, migration-sensitive, or deployment-affecting.

For a selected Project, use the engineering profile named by its working
contract. For bounded repository work with no Project, use only
`_shared/engineering/profiles/direct-repository.md#direct-repository` and its
triggered sections.

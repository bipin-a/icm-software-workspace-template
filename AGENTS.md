# ICM Software Workspace

This repository runs software Projects through one shared ICM workflow. A newly instantiated copy remains unconfigured until `setup/questionnaire.md` is complete.

## Start here

1. If maintaining the reusable template itself, read `README.md` and `_shared/methodology/interpretable-context-methodology.md`; leave the setup questionnaire incomplete.
2. Otherwise read `setup/questionnaire.md`. If its status is not `complete`, follow `setup/CONTEXT.md` before starting a Project.
3. Read `CONTEXT.md`.
4. Identify the Project under `projects/`.
5. Read its `workflow_stage`, then read only that Project and the relevant workflow `CONTEXT.md`.
6. Load only the inputs and references named by that workflow.

For human-facing and repository-facing communication, read and follow `_shared/voice.md`.

For workflow, routing, or workspace-structure changes, first read `_shared/methodology/interpretable-context-methodology.md`. Preserve that ICM foundation before adding repository-specific rules.

## Where things live

- `setup/` — one-time factory configuration and its completion state.
- `workflows/` — shared stages and their contracts.
- `projects/` — Project-specific working artifacts.
- `architecture/` — repository-level architecture work with no natural parent Project.
- `roadmap/` — future product directions that have not become Projects.
- `_shared/` — stable cross-Project rules and shared knowledge.
- `_templates/` — blank starters for new artifacts.
- `app/` — application code, once the technical structure is chosen.

## Rules

- One home per fact; link instead of copying.
- Keep routing files short.
- Do not move to the next stage until the user accepts the current output.
- Treat the Project's current specifications as intended behaviour; conversation can select or question work but cannot silently replace those specifications.
- Do not proceed through Build, Validate, or Release while the Project has an unresolved `architecture_hold` that affects that work.
- Do not treat summaries as current Git, deployment, or database state.
- Treat delegated findings as evidence, not authority: verify material claims, separate observations from recommendations, and leave product decisions to the user.

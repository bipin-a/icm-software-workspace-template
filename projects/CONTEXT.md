# Projects

Each child folder is one lightweight Project record. Projects use the shared workflow under `../workflows/`; they do not copy it.

## Create a Project

1. Choose a unique kebab-case folder name.
2. Copy `../_templates/project/PROJECT.md` into it.
3. Keep the template's links to the shared workflow.
4. Complete the Project intent before creating specifications.
5. Let Spec & Design create the `specs/` files from the shared templates.
6. Let Assess Delivery create `delivery-assessment.md` before Build.

## Lifecycle

Use one status in `PROJECT.md`: `proposed`, `active`, `paused`, `completed`, `cancelled`, or `superseded`.

Do not add a Project-local `CONTEXT.md` unless the Project becomes a genuine sub-workspace with its own repeating workflow.

## Architecture spikes

A spike answers a narrow uncertainty for a sponsoring Project. It does not own product intent, ship user value, or receive a copied Project workflow.

- Use `architecture_hold: none` when no unresolved spike blocks the Project.
- The evidence-custodian Project links the unresolved spike in `active_spike`.
- Other affected Projects list the unresolved spike under `affected_by_spikes`. If its hold blocks their current work, set their `workflow_stage` to the active architecture-spike substage.
- After the decision is reconciled, clear the active spike fields. Preserve history through the decision summary, ADR or specification link, and iteration log rather than an ever-growing frontmatter list.
- Pause only workstreams whose assumptions may be invalidated. A shared contract, data model, source of truth, or foundational dependency may justify a wider hold.
- Project-local decisions live under `projects/<project-slug>/decisions/`. Cross-Project decisions live under `_shared/architecture/decisions/` when earned.
- A spike that develops an independent product outcome, specification, priority, or release should be promoted to a Project.

## Iterations

A Project may repeat Build → Validate → Assess Readiness several times before Release. This is one Project lifecycle, not a new Project or copied workflow.

- `PROJECT.md` shows the exact workflow folder in `workflow_stage`, the candidate `iteration`, and its `current_build` identifier. Update the stage whenever a gate chooses a route.
- Increment `iteration` only when Build produces a new candidate for validation. Rechecking evidence for the same candidate does not create a new iteration.
- Keep only the current build, validation, and readiness summaries under `summaries/`.
- Append one compact row to `summaries/iteration-log.md` for each readiness decision, architecture-spike decision, or in-flight Learn detour. The same iteration may have several rows when the evidence is reassessed without a code change.
- When Build creates a new candidate, clear the Project links to the prior validation and readiness summaries. Replace stale summaries only after their decision and evidence links are captured in the log.
- Use an exact commit SHA when Git exists. Otherwise use an unambiguous build or artifact identifier.
- Keep detailed historical diffs and discussion in pull requests and Git once they exist. Do not create per-iteration folders unless an audit or safety requirement earns them.

No summary file is required before its stage has been reached.

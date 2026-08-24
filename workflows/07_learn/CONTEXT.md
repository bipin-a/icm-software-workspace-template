# 07_learn — update the right source

One job: preserve a meaningful lesson and update the source that should change future work.

Learn may run after Release or as an in-flight detour from any stage. After an in-flight lesson is applied, resume at the earliest stage invalidated by the change.

Learn is not active containment or recovery. When users, data, or a live system remain at risk, stabilize the situation before using this stage to preserve the lesson and correct its canonical owner.

## Inputs

- Working: the selected Project's specifications and current summaries
- Working: relevant prototype findings
- Working when relevant: `../../roadmap/future-features.md`
- Reference: `references/learning-rules.md`
- Reference: the relevant file under `../../_shared/principles/`
- Reference: the workflow contract affected by the lesson, when applicable
- Template: `../../_templates/lesson.md`

Do not retain chat transcripts or routine progress narration.

## Process

1. Classify the lesson as Project, Factory, Input contract, Execution, or External change.
2. Record expected behaviour, what happened, evidence, and why the existing control failed.
3. Choose the single canonical owner that should change future work.
4. Update that source when the lesson is accepted.
5. Record how a future run will detect or prevent recurrence and any remaining risk.
6. If the lesson occurred in flight, record it in the iteration log and route to the earliest invalidated stage.

## Outputs

- `../../projects/<project-slug>/lessons.md`
- Updates to the specification, workflow, template, routing file, roadmap, or shared principle that owns an accepted lesson

## Human check

Confirm that each lesson is accurate, has the correct owner, and changes the factory only when the failure could recur across Projects.

## Skill routing

- Use `documentation-and-adrs` when a durable architecture decision must be recorded.

Invoke a skill only when its condition is present.

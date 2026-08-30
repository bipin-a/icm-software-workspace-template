---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/release-learn.md
    heading: 07_learn
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Desired outcome, Scope, Non-goals, Completion, Canonical artifacts]
  selectors:
    - path: roadmap/future-features.md
      when: the accepted lesson identifies plausible future direction outside current scope
    - path: _templates/prototype-evidence.md
      when: Project-local prototype evidence supports the named lesson
    - path: _templates/architecture-investigation.md
      when: Project-local architecture evidence supports the named lesson
  references:
    - path: workflows/07_learn/references/learning-rules.md
  output_templates:
    - path: _templates/lesson.md
---

# 07_learn — apply an earned lesson to the right owner

One job: preserve meaningful evidence and correct the single source that should
change future work. Learn is optional after Release and may be entered as an
in-flight detour from any stage.

Learn is not containment, rollback, recovery, or incident response. Stabilize
users, data, and live systems before preserving the lesson.

## Inputs

- Repository input, profile, reference, and output template are declared by
  `context` above.
- Working: the Project artifacts and exact implementation, validation, or
  release evidence that revealed the lesson.
- Conditional repository inputs are declared by `context.selectors` above.
- Conditional reference: the specification, workflow contract, template,
  safeguard, principle, or routing file that may own the correction.
- Capability routing: `../CONTEXT.md`.

Do not create a lesson for routine progress, a successful release with no new
understanding, chat narration, or an unsupported impression. Do not load
unrelated Projects, the complete shared factory, or evidence that does not
support the named lesson.

## Process

1. Confirm that evidence establishes a meaningful Project-local or cross-
   Project lesson and that active harm is already stabilized.
2. Record expected behavior, what happened, exact evidence, why the existing
   control failed, recurrence credibility, and remaining risk.
3. Classify the cause as Project, Factory, Input contract, Execution, or
   External change.
4. Choose one canonical owner using `references/learning-rules.md`.
5. Apply an accepted correction to that owner. Keep the Lesson as evidence, not
   a second instruction source. If no source should change, record why.
6. Have the human approve the evidence, scope, owner, correction, and remaining
   risk. Cross-Project promotion requires credible recurrence beyond one local
   execution.
7. Link the Lesson from `PROJECT.md`. When the correction invalidates an earlier
   artifact or proof, return to the earliest affected stage.

## Outputs

- `../../projects/<project-slug>/lessons/<lesson-slug>.md`, only when earned
- An accepted update to one canonical source, when appropriate
- A durable Lesson link in `../../projects/<project-slug>/PROJECT.md`

Do not maintain a central live lesson catalog, copy lessons into stage folders,
or create an Iteration Log.

## Human check

Confirm that the Lesson is evidence-backed, has one correct owner, changes the
shared factory only when recurrence is credible across Projects, and routes
back to every stage invalidated by the accepted correction.

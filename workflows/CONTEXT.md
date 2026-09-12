---
type: workflow-hub
status: active
---

# Software delivery workflow

One job: route the requested outcome through the next useful delivery stage.

## Stages

| Stage | Job |
|---|---|
| [01_understand](01_understand/CONTEXT.md) | Establish intent, product behavior, scope, and acceptance. |
| [02_design](02_design/CONTEXT.md) | Choose technical owners and a proportionate delivery shape. |
| [03_build](03_build/CONTEXT.md) | Implement, publish, and identify the candidate. |
| [04_validate](04_validate/CONTEXT.md) | Review the candidate and gather the required proof. |
| [05_assess-readiness](05_assess-readiness/CONTEXT.md) | Resolve findings and choose the next route. |
| [06_release](06_release/CONTEXT.md) | Plan, execute, and verify an authorized environment change. |
| [07_learn](07_learn/CONTEXT.md) | Apply an evidence-backed improvement to its owner. |

The normal progression is Understand → Design → Build → Validate → Assess
Readiness → Release → Learn. Enter at the next unresolved decision or action;
reuse completed decisions and proof. Release applies only when requested, and
Learn applies when evidence earns a correction. Return to an earlier stage
when new evidence changes its decision.

Design, Build, Validate, Assess Readiness, and Release have focused substeps.
Their parent contracts select the next substep; load only that contract and its
needed inputs. Continue authorized work across stage boundaries in the same
task. A folder boundary does not require another approval or conversation.

## Project path binding

For selected Project work, bind `<project-slug>` to exactly one
`projects/<project-slug>/PROJECT.md`. An unresolved placeholder is not an input.
For bounded work, use chat/PR context; do not create an artifact to fill a path.

`workflow: feature-work` identifies this seven-stage workflow. Use one living
brief when durable coordination needs it; decisions may stay in chat/PR for
bounded work. Separate specifications, stage summaries, and approval receipt
files are not required. Additional decision documents must earn their place
and have one canonical owner.

Read only the selected contract, relevant decision documents, and triggered
headings from the [engineering profile](../_shared/engineering/profiles/direct-repository.md#direct-repository).
Apply [decision work](../_shared/engineering/decision-work.md) on every route.
GitHub and deployment providers own live status; link their evidence without
copying changing state into the brief.

## Capability routing

Use a specialized method when its trigger is present. The selected stage keeps
ownership of the outcome and its authority requirements.

| Trigger | Method or owner |
|---|---|
| Missing or contradictory intent | Understand |
| Unresolved root cause, approach, or delivery trade-off | Design |
| Current framework, API, CLI, or cloud fact | Configured official-source verification |
| Regression or high-risk behavior | Discriminating failure-first proof |
| Independently verifiable slices or ownership boundaries | Incremental implementation |
| Material user-interface work | Interface evidence and frontend engineering |
| Public or cross-component contract | API and interface design |
| Data, ownership, compatibility, or behavior migration | Migration and recovery design |
| Consequential unresolved reasoning or an explicit request | Bounded independent review or human decision |
| Ordinary localized work | The selected stage without an extra method |

File count alone does not trigger a method. External or delegated findings are
evidence; apply the canonical finding rules before treating them as work.

## Human check

Use existing explicit authority. Resolve material open choices and review the
completed result within the requested scope. Do not infer approval from a file,
metadata, a green check, or the mere existence of a review link. Production
release retains its applicable authorization and verification requirements.
Review coupled technical and delivery choices together, and revisit only the
decisions and proof affected by changed evidence.

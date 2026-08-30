---
type: workflow-hub
status: active
---

# Project delivery workflow

One job: route one accepted Project through the smallest applicable delivery
path. This is the canonical Project-delivery workflow.

Select one `projects/<project-slug>/PROJECT.md`. Read only its current stage
contract, named working artifacts, and exact shared references. Git and the
configured delivery system own implementation history and changing delivery
state. Deployment systems own live environment state. Project files link those
owners without copying them.

## Project path binding

- Before a stage, select and report one exact
  `projects/<project-slug>/PROJECT.md`.
- `<project-slug>` then means only that directory. Resolve and report each
  resulting input path before reading it.
- An unresolved placeholder is invalid. Do not scan Projects or infer that an
  issue, branch, or deployment belongs to the selected Project.

## Stages

| Stage | Job | Required handoff |
|---|---|---|
| [`01_understand/`](01_understand/CONTEXT.md) | Approve the problem, desired behavior, scope, acceptance, and mandatory interface evidence when UI-affecting | Exact approved Product Specification revision and applicable interface evidence |
| [`02_design/`](02_design/CONTEXT.md) | Choose a technical path with its delivery consequences, then finalize the exact delivery shape | Exact approved Technical Specification and Delivery Assessment revisions |
| [`03_build/`](03_build/CONTEXT.md) | Implement the approved shape | Exact implementation pull request or commit |
| [`04_validate/`](04_validate/CONTEXT.md) | Report evidence and findings for the exact candidate | Focused proof and one terminal exact-candidate integration gate on canonical delivery surfaces |
| [`05_assess-readiness/`](05_assess-readiness/CONTEXT.md) | Dispose findings and choose the next route | Human disposition for the exact candidate |
| [`06_release/`](06_release/CONTEXT.md) | Promote and verify the approved candidate one environment at a time | Canonical deployment and verification evidence |
| [`07_learn/`](07_learn/CONTEXT.md) | Apply an earned lesson to the right owner | Project-local lesson and any accepted canonical-source correction |

The normal direction is `01` through `07`, but a human decision or invalidated
input may route backward. Learn is optional and may be entered from any stage.
Do not infer approval from a file's existence, a branch name, or a green check.

## Capability routing

Use a specialized method only when its trigger is present. The current stage
still owns its output and human gate.

| Trigger | Route |
|---|---|
| Missing, ambiguous, materially changed, or contradictory intent | Understand |
| Unresolved root cause, technical approach, or delivery trade-off | Design |
| Current framework, library, SDK, API, CLI, cloud, or version fact | Repository-configured official-source verification |
| Regression or high-risk observable behavior | Test-driven method |
| Independently verifiable slices or an ownership or deployment boundary | Incremental implementation |
| Material user-interface work | Frontend engineering |
| Public or cross-component contract | API and interface design |
| Material data, ownership, compatibility, behavior migration, or retirement | Migration method |
| Consequential unresolved reasoning or explicit human request | Fresh-context adversarial review |
| Ordinary localized work | No extra method ceremony |

File count alone does not trigger a method. A delegated or external finding is
evidence, not authority; an accepted correction updates its canonical owner.

## Human check

At every boundary, confirm the exact incoming artifact or external candidate,
the evidence that applies to it, and the selected next route. A changed input
invalidates only the downstream decisions and proof that depend on it.

---
type: workflow-hub
status: active
---

# Workflow selection

One job: route the requested outcome to its working contract.

| Need | Contract |
|---|---|
| Bounded repository task or coordinated Project | [Feature work](feature/CONTEXT.md) |
| Uncertain or changed product interface | [Interface evidence](feature/references/interface-evidence.md) |
| Review a candidate or evaluate findings | [Review rules](feature/references/review-rules.md) |
| Authorized deployment | [Release rules](feature/references/release-rules.md) |
| Earned improvement to shared guidance | [Learning rules](feature/references/learning-rules.md) |

## Project path binding

For selected Project work, bind `<project-slug>` to exactly one
`projects/<project-slug>/PROJECT.md`. An unresolved placeholder is not an input.
For bounded work, use chat/PR context; do not create an artifact to fill a path.

Read only the working contract, relevant decision documents, and selected
profile headings. Revisit affected decisions when evidence changes them;
folder order does not impose investigation order.

## Human check

Use existing explicit authority. Resolve material open choices and review the
completed result within the requested scope. Do not infer approval from a file,
metadata, a green check, or the mere existence of a review link. Production
release retains its applicable authorization and verification requirements.

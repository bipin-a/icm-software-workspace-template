---
type: workflow-router
---

# 02_design — select technical and delivery decisions

One job: select the next unresolved technical or delivery decision.

## Inputs

- Accepted chat/PR decisions, or the selected Project's Technical choices,
  Acceptance and proof, and Open questions.
- The current question and existing authority; read only the decision links
  needed to choose a substep.

Do not load application code, whole reference libraries, or other substeps
while routing. The selected substep owns the necessary investigation.

## Routes

1. If intended behavior is unclear, return to
   [Understand](../01_understand/CONTEXT.md). Technical feasibility may inform
   that decision without a separate approval cycle.
2. For an unresolved approach, owner, boundary, or feasibility question, use
   [Choose technical design](01_choose-technical-design/CONTEXT.md).
3. When work ordering, dependencies, delivery effort, or rollout need a choice,
   use [Choose delivery shape](02_choose-delivery-shape/CONTEXT.md).
4. When the applicable decisions are sufficient, continue to
   [Build](../03_build/CONTEXT.md). A settled small task needs no new design
   artifact. New evidence revisits only the affected decisions.

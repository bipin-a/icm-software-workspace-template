---
type: workflow-router
---

# 03_build — select the next implementation or delivery action

One job: select the next action needed to complete the accepted implementation.

## Inputs

- Accepted chat/PR decisions or the selected brief and its linked delivery plan.
- Branch identity, remaining acceptance, and linked live delivery state needed
  to choose the next action.

Do not load implementation code, complete diffs, test output, or other substeps
while routing. Load those inputs in the substep that needs them.

## Routes

1. Resolve a missing product decision in [Understand](../01_understand/CONTEXT.md)
   or a technical or delivery decision in [Design](../02_design/CONTEXT.md).
2. For a multi-PR plan whose coordination objects are missing, use
   [Prepare delivery](01_prepare-delivery/CONTEXT.md). One PR skips this step.
3. For remaining accepted behavior, use
   [Implement an increment](02_implement-increment/CONTEXT.md). Continue
   increments until the intended slice is complete.
4. When publication is in scope and the slice is ready for review, use
   [Publish the slice](03_publish-slice/CONTEXT.md).
5. When the required implementation is complete, use
   [Assemble the candidate](04_assemble-candidate/CONTEXT.md), then
   [Validate](../04_validate/CONTEXT.md).

Continue authorized work across these steps. Publishing and merging remain
subject to the requested scope and live repository requirements.

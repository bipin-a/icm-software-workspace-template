---
type: workflow-router
---

# 05_assess-readiness — select finding disposition or the next route

One job: select the decision needed to finish or advance the candidate.

## Inputs

- The exact candidate and requested completion boundary.
- Validation evidence, material findings, existing human dispositions, and
  applicable chat/PR or brief decisions.

Do not load full diffs, code, raw logs, or other substeps while routing. Select
only the evidence and decision that can change the next action.

## Routes

1. For a material finding without an applicable disposition, use
   [Dispose the finding](01_dispose-finding/CONTEXT.md).
2. Carry an accepted correction to its owning stage. Return incomplete proof
   to [Validate](../04_validate/CONTEXT.md); a finding disposition alone does
   not complete validation.
3. When the required evidence and dispositions are sufficient, use
   [Choose the route](02_choose-route/CONTEXT.md) to finish local work, merge
   within authority, release when requested, or return for further work.
4. Reuse the human decision already given for the same candidate and finding.
   Revisit only decisions and proof affected by a subsequent change.

---
type: workflow-router
---

# 04_validate — select the next candidate evidence

One job: select the review or proof still needed for the exact candidate.

## Inputs

- The candidate base and head, accepted chat/PR or brief decisions, and proof
  obligations.
- Existing review, test, and gate evidence plus unresolved finding identities.

Do not load code, complete diffs, raw test logs, or other substeps while routing.
Use linked evidence summaries to choose the next bounded action.

## Routes

1. For absent or affected review, use
   [Review the candidate](01_review-candidate/CONTEXT.md).
2. Route a material finding needing a decision to
   [Assess Readiness](../05_assess-readiness/CONTEXT.md) before proof that its
   required correction would invalidate.
3. For missing acceptance or risk evidence, use
   [Validate a criterion](02_validate-criterion/CONTEXT.md). Reuse existing
   evidence when it still applies; group criteria when one check proves them.
4. When a full integration gate is required and focused evidence is sufficient,
   use [Verify the candidate gate](03_verify-candidate-gate/CONTEXT.md).
   Otherwise record why the gate is not applicable.
5. Use [Complete validation](04_complete-validation/CONTEXT.md) to establish
   coverage, omissions, and findings, then continue to Assess Readiness.
6. On a candidate change, compare the diff with the tested revision and repeat
   affected proof. Changed intent or architecture returns to its decision owner.

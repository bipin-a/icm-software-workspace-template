---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Links]
  references:
    - path: workflows/04_validate/references/review-rules.md
      headings: [Baseline review, Conditional angles, Finding format]
---

# 01_review-candidate — Review the exact candidate

One job: inspect the candidate for concrete defects against the accepted outcome.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact base and candidate, complete comparison diff, affected code owners, existing proof, and current review findings.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Pin the comparison base, candidate, and applicable decision revisions. Identify the actual behavior and owners changed by the complete diff.
2. Apply baseline review and only the conditional angles triggered by the change. Verify each suspected defect at its owning seam.
3. Use [Finding format](../references/review-rules.md#finding-format) to distinguish evidence, supported scenarios, consequences, and the response decision.
4. Record actionable findings, or a clean review when none survive inspection, with coverage and omissions on the owning review surface.
5. Route findings needing a decision to [Assess Readiness](../../05_assess-readiness/CONTEXT.md) before expanding implementation or running proof that a required correction would invalidate.

## Outputs

- Candidate-specific review evidence and findings with exact locations and consequences.

## Human check

Review findings are evidence. Apply existing authority when selecting a response; obtain missing material decisions before expanding scope.

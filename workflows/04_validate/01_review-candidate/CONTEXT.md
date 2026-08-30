---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/validate-readiness.md
    heading: 04_validate-review
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Human decision]
    - path: projects/<project-slug>/specs/product-spec.md
      headings: [Approved decisions]
      tables:
        - heading: Acceptance criteria
          columns: [ID, Observable criterion, Required evidence]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings: [Approved decisions, Risks and open questions]
  references:
    - path: workflows/04_validate/references/review-rules.md
  selectors:
    - path: _shared/principles/ux-principles.md
      when: the candidate changes a user interface or interaction
    - path: _shared/ux/ui-ux-rules.md
      when: the candidate changes a user interface or interaction
---

# 01_review-candidate — review the exact candidate

One job: inspect the pinned candidate for concrete defects and record findings
on its canonical review surface. This step does not fix or dispose findings.

## Inputs

- Repository inputs, selected headings, profile, and reference are declared by
  `context` above.
- Live working input: exact candidate, base and head identities, commits, diff,
  checks, and existing review findings.

Do not load full specifications, unrelated code, complete test-suite output,
other pull requests, another stage's references, or the engineering library.

## Process

1. Pin the approved artifact revisions and exact candidate base and head.
2. Apply `Baseline review`, then only the conditional angles whose triggers
   occur in the candidate.
3. Inspect changed code in bounded groups and verify each suspected defect at
   its public or owning seam.
4. Record actionable findings using `Finding format`, including exact location,
   consequence, evidence, severity, and owning correction route.
5. Record a clean review explicitly when no finding survives verification.

## Outputs

- Review findings or clean-review evidence on the exact review surface
- Stable review link in the Project record

## Human check

Confirm the candidate identity, review coverage, conditional angles, findings,
and omissions before criterion proof or readiness disposition relies on them.

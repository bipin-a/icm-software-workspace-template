---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/validate-readiness.md
    heading: 04_validate-complete
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Final proof and release shape, Human decision]
---

# 04_complete-validation — complete the validation handoff

One job: verify that review, required criterion evidence, and the full gate are
terminal for one unchanged candidate and route that evidence to Assess
Readiness.

## Inputs

- Repository inputs, selected headings, and profile are declared by `context`
  above.
- Live working input: exact candidate, review links, criterion-evidence links,
  terminal integration-gate evidence, findings, and skipped proof.

Do not load full specifications, implementation code, complete diffs, raw logs
already represented by terminal evidence, another stage's references, or the
engineering library.

## Process

1. Use the repository-configured verification mechanism to confirm that the
   exact unchanged candidate has one terminal full-gate result. A prior
   candidate or incomplete result is not admissible.
2. Verify the candidate has not changed since every other admitted evidence
   item.
3. Confirm baseline review, applicable conditional review, every required
   criterion, environment, material risk, integration-gate phase, and explicit
   skipped proof has a terminal linked result.
4. Keep findings unresolved; validation reports them and does not dispose them.
5. Add stable validation links to the Project without copying live check or
   review state.
6. Route the exact evidence set to Assess Readiness. A changed candidate returns
   to validation.

## Outputs

- Exact candidate identity plus complete linked validation and full-gate
  evidence
- Durable Assess Readiness handoff in the Project record

## Human check

Confirm the candidate identity, evidence coverage, gate result, findings,
failures, and skipped proof are complete enough for disposition. This does not
accept the candidate.

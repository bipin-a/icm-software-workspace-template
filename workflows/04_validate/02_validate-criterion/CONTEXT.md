---
type: workflow-step
context:
  parameters: [slice, criteria]
  profile:
    path: _shared/engineering/profiles/validate-readiness.md
    heading: 04_validate-criterion
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Human decision]
      tables:
        - heading: Proposed delivery slices
          match: prefix
          values: ["{slice}. "]
    - path: projects/<project-slug>/specs/product-spec.md
      tables:
        - heading: Acceptance criteria
          match: prefix
          values: ["{criteria}"]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings: [Architecture and canonical owners, Risks and open questions]
      tables:
        - heading: Testing and acceptance proof
          match: contains
          values: ["{criteria}"]
        - heading: Environments and test data
          columns: [Environment, Intended proof]
---

# 02_validate-criterion — prove one accepted criterion

One job: obtain terminal evidence for one Product criterion on the exact
candidate. Another fresh context validates the next criterion.

## Inputs

- Repository inputs, selected headings and rows, and profile are declared by
  `context` above.
- Live working input: exact candidate identity, relevant changed code and proof
  seam, existing checks, environment and data identity, and prior evidence for
  this criterion.
- Capability routing: `../../CONTEXT.md`.

Do not load other criteria, full specifications, the complete candidate diff,
unrelated tests, another stage's references, or the engineering library.

## Process

1. Pin the candidate and mutually applicable approved artifacts.
2. Name the criterion's initial state, action, observable consequence, evidence
   environment, data source and type, dataset version or baseline, reset method,
   and important differences from production.
3. Run focused proof at the owning seam before any wider required check. Test
   the change, reversal, reload, partial-failure, or boundary state only when
   the criterion or a material risk earns it.
4. Use a real browser, migration, security, performance, shared-environment, or
   other specialized proof only when the accepted contract requires it. For
   assembled delivery, prove the integration candidate rather than relying only
   on child results.
5. Record exact commands or procedures, terminal results, what the evidence
   proves and does not prove, skipped proof, uncertainty, and any finding on the
   candidate's canonical delivery surface. Controlled local, fixture, mock, or
   non-production evidence does not by itself prove real-world adoption.

## Outputs

- Terminal evidence and findings for one criterion on the exact candidate
- Stable evidence link in the Project record

## Human check

Confirm the criterion, candidate identity, environment and data identity,
terminal result, finding relationship, and skipped proof before selecting
another criterion or completing validation.

---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/design-build.md
    heading: 02_design-delivery
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Desired outcome, Scope, Non-goals, Completion, Canonical artifacts]
    - path: projects/<project-slug>/specs/product-spec.md
      tables:
        - heading: Acceptance criteria
          columns: [ID, Observable criterion, Required evidence]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Migration and compatibility
        - Release, rollback, and monitoring
        - Risks and open questions
      tables:
        - heading: Design options and decision
          match: row-contains
          values: ["| Selected |"]
          exactly: 1
        - heading: Environments and test data
          columns: [Environment, Intended proof]
  output_templates:
    - path: _templates/delivery-assessment.md
    - path: _templates/approval-receipt.md
---

# 02_choose-delivery-shape — approve a proportionate delivery shape

One job: decide whether and how the approved specifications should be
delivered. This step does not create implementation branches, issues, or pull
requests.

## Inputs

Repository inputs, selected headings and rows, profile, and output template are
declared by `context` above. The consuming approval identifies the exact
specification revisions being assessed. A changed specification requires
reassessment.

Do not load complete specifications, implementation branches, live delivery
status, validation evidence, release material, or the full engineering library.

## Process

1. Confirm the selected Technical Specification option, its evidence, and its
   delivery-shape and effort estimate without copying that estimate into the
   Delivery Assessment.
2. Restate the accepted outcome before assessing implementation. Assess expected
   value, assumptions, why now, appetite, consequence of delay, next-best use
   of effort, relative size, consequence risk, fragility, affected surfaces,
   validation burden, and material uncertainty. Do not collapse these into a
   false-precision score.
3. Compare only credible delivery shapes: the selected implementation, the
   smallest reversible shape that preserves the intention, phased or proof-of-
   concept delivery, a prototype or investigation for a material unknown, and
   defer or reject. State what each removes, delays, or leaves unproved.
4. Do not reduce user trust, accessibility, data integrity, security, privacy,
   or recovery merely to reduce scope.
5. Draft coherent vertical slices with separate size, risk, uncertainty,
   dependencies, and required proof. Divide a large slice unless a broad
   mechanical change cannot be split safely. The slice table is canonical; any
   diagram is a derived view of that table.
6. For multi-pull-request delivery, define vertical outcomes, blockers, merge
   conditions, integration-branch lifetime, combined proof, and human
   checkpoints without copying live delivery status.
7. Add future flexibility only when the pressure is credible, affects a hard-
   to-change boundary, a cheap seam avoids disproportionate migration, and the
   seam creates no parallel model or speculative framework.
8. Name the exact environments, migrations, rollback, monitoring, and final
   proof required by the specifications.
9. If exact planning materially changes the selected option's estimated cost,
   risk, or architecture, return to technical design before approval.
10. Record accepted scope, omissions, trade-offs, and the human decision.

## Outputs

- `../../../projects/<project-slug>/delivery-assessment.md`

Create live delivery objects only after the human approves this output. Link
those objects from `PROJECT.md`; the configured delivery system owns their
changing state.

## Human check

First decide whether the Project remains worth doing at the assessed cost, then
approve the selected technical path together with its delivery profile, slices,
omissions, human gates, and exact specification revisions. Product changes
return to Understand; a material mismatch with the estimated technical path
returns to technical design; an approved assessment continues to Build.

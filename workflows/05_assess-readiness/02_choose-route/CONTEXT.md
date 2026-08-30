---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/validate-readiness.md
    heading: 05_readiness-route
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Final proof and release shape, Human decision]
  references:
    - path: _shared/definition-of-done.md
---

# 02_choose-route — select the candidate's next stage

One job: after every material finding is disposed, select one next route for the
exact candidate. This step does not merge, deploy, or change the candidate.

## Inputs

- Repository inputs, selected headings, profile, and references are declared by
  `context` above.
- Live working input: exact candidate, terminal validation evidence, and every
  material finding disposition.

Do not load full specifications, implementation code, complete diffs or logs,
another stage's references, or the engineering library.

## Process

1. Verify the candidate is unchanged and every material finding has one
   approved disposition with no unresolved applicable hold or decision.
2. Select exactly one route: Build correction, Validate, Understand, Technical
   Design, Delivery-shape Design, Architecture Investigation, Release, Roadmap,
   or defer or abandon on the owning delivery surface.
3. Record accepted-risk consequences, affected users, mitigation, recovery,
   approver, revisit trigger, and remaining obligations with the route.
4. Route uncertain evidence to Validate unless the uncertainty is in the
   implementation approach, delivery shape, or product intent; those return to
   Technical Design, Delivery-shape Design, or Understand respectively.
5. A changed specification invalidates dependent delivery assessment, Build,
   validation, and readiness conclusions. Rebuild and revalidate the exact new
   candidate rather than relabeling existing evidence.
6. Record the decision on the candidate's canonical approval surface and link
   it from the Project without copying live status.
7. Release routing admits only this exact candidate and does not authorize any
   environment. A changed candidate returns to Validate.

## Outputs

- All finding dispositions plus one selected route on the canonical surface
- Durable route and approval link in the Project record

## Human check

Approve every disposition, accepted risk, and the one selected route. Release
is allowed only for the unchanged candidate with no unresolved applicable
decision or hold.

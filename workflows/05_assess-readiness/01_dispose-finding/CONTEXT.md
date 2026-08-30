---
type: workflow-step
context:
  parameters: [criteria]
  profile:
    path: _shared/engineering/profiles/validate-readiness.md
    heading: 05_readiness-finding
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/specs/product-spec.md
      tables:
        - heading: Acceptance criteria
          match: prefix
          values: ["{criteria}"]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Architecture and canonical owners
        - Release, rollback, and monitoring
        - Risks and open questions
      tables:
        - heading: Testing and acceptance proof
          match: contains
          values: ["{criteria}"]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Human decision]
  references:
    - path: _shared/definition-of-done.md
---

# 01_dispose-finding — decide one material finding

One job: give one validation finding a human disposition for the exact
candidate. This step does not change code, specifications, or other findings.

## Inputs

- Repository inputs, selected headings and rows, profile, and references are
  declared by `context` above.
- Live working input: exact candidate identity and one material validation
  finding with its evidence.

Do not load other findings, full specifications, implementation code, complete
diffs or logs, another stage's references, or the engineering library.

## Process

1. Verify the candidate and finding evidence are exact and mutually applicable.
2. Classify evidence as `confirmed`, `invalid`, or `uncertain`; classify its
   contract relationship as `violates`, `outside`, `ambiguous`, `conforms`, or
   `accepted constraint`; and classify impact as `blocker`, `material`, or
   `opportunity`. Record the consequence, affected users, recovery path, and
   decision owner.
3. Choose one disposition: fix implementation, change specification, reassess
   delivery, investigate architecture, revalidate, accept risk, move future
   direction to the roadmap, defer or abandon, dismiss with reason, or release.
4. For accepted risk, record consequence, affected users, mitigation, recovery
   path, approver, and observed revisit trigger. For deferred code, name its
   explicit branch, revert, disable, or close disposition.
5. Record the disposition on the owning review, pull-request, issue, or
   configured approval surface and add only its stable link to the Project.
6. Do not edit a specification merely to make it match built code. A product
   change requires rationale and human approval in Understand.

## Outputs

- One human finding disposition on the exact candidate's canonical surface
- Stable disposition link in the Project record

## Human check

Approve this finding's disposition, consequence, affected users, recovery,
owner, and route. This does not dispose any other finding or authorize an
environment promotion.

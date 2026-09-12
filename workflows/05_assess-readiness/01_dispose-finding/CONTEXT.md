---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions]
  references:
    - path: _shared/definition-of-done.md
      headings: [Finished Project workflow]
    - path: workflows/04_validate/references/review-rules.md
      headings: [Finding format]
---

# 01_dispose-finding — Choose the response to a finding

One job: resolve one finding using its evidence, consequence, and decision authority.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact candidate, finding and evidence, affected accepted decisions, and any existing human disposition.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify the finding applies to the candidate and that its scenario can occur within supported behavior. Distinguish confirmed, uncertain, and invalid evidence.
2. Explain the consequence, affected users, contract relationship, recovery path, decision owner, credible responses, costs, and recommended action using the canonical finding guidance.
3. Reuse an existing applicable disposition. Otherwise resolve the response: fix, investigate, change an accepted decision, revalidate, accept risk, defer, or dismiss with evidence.
4. For accepted risk, make the consequence and remaining obligations clear. Record the human authority and any mitigation or revisit trigger on the owning chat/PR.
5. Route the correction to its canonical owner. A product change returns to Understand, technical or delivery changes to Design, code corrections to Build, and missing proof to Validate.

## Outputs

- One evidence-backed disposition and correction route tied to the exact finding and candidate.

## Human check

Use the human decision already given when it covers this finding. Obtain missing authority for material risk acceptance or changed scope; one disposition does not cover unrelated findings.

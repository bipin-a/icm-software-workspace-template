---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions, Intent, Links]
---

# 05_assess-readiness — Decide findings and the next route

One job: resolve material findings and choose the next action for the exact candidate. Skip when no finding or route decision remains.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the brief sections named in frontmatter and relevant linked decision owners. Bounded work needs no Project.
- The exact candidate, evidence, finding dispositions, requested completion boundary, and live merge preconditions when relevant.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Verify each finding can occur within supported behavior and applies to this candidate. Distinguish confirmed, uncertain, and invalid evidence.
2. Explain consequence, users, contract relationship, recovery, decision owner, credible responses, costs, and recommendation. Reuse applicable dispositions; otherwise select fix, investigate, change an accepted decision, revalidate, accept risk, defer, or dismiss with evidence.
3. Record human authority, mitigation, and revisit triggers for accepted material risk. Route product changes to Understand, technical/delivery changes to Design, code corrections to Build, and missing proof to Validate.
4. Apply the scoped definition of done. Required checks, open holds, and unresolved material choices remain blocking unless their owning authority changes the requirement.
5. Choose one route: correction, more proof, finish local work, merge when authorized, Release when requested, or stop. Before merge, verify current head, base, live policy, checks, reviews, and authority under GitHub delivery rules.
6. Record the decision and remaining obligations on chat/PR. Apply Learn only when an evidenced correction is earned. Non-deployment work finishes at its requested boundary.

## Outputs

- PR: applicable finding dispositions, accepted risks, and one next route for the exact candidate.

## Human check

Reuse existing decisions. Obtain missing authority for material risk or changed scope. Merge readiness does not authorize environment writes.

## Rules

This table is the only list of rules and references this stage loads. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-AGENT-PRESENTED-APPROVAL`; `RULE-CONTRADICTIONS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for several PRs: `RULE-INTEGRATION-DELIVERY` |
| [`definition-of-done.md`](../../_shared/definition-of-done.md) | `Finished Project workflow` |
| [`review-rules.md`](../04_validate/references/review-rules.md) | `Finding format` |
| [`github-delivery-rules.md`](../../_shared/engineering/github-delivery-rules.md) | `Checks and delivery truth`; `Traceability and human gates`; `Merge methods preserve evidence and history` |
| [`multi-pr-delivery.md`](../../_shared/engineering/multi-pr-delivery.md) | Conditional for several PRs: `Finish` |

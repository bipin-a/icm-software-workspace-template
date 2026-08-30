---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/design-build.md
    heading: 02_design-technical
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts]
    - path: projects/<project-slug>/specs/product-spec.md
      headings: [Product behavior options, Product workflow and reachable states, Product behavior and rules, Scope and non-goals, Acceptance criteria, Approved decisions, Open questions]
  selectors:
    - path: roadmap/future-features.md
      when: credible future pressure may constrain a hard-to-change boundary
    - path: _templates/prototype-evidence.md
      when: a disposable experiment can distinguish technical options
    - path: _templates/architecture-investigation.md
      when: material architecture uncertainty blocks an accepted decision
    - path: _templates/adr.md
      when: an accepted material durable architecture decision requires rationale
  output_templates:
    - path: _templates/specification/technical-spec.md
    - path: _templates/approval-receipt.md
---

# 01_choose-technical-design — choose the simplest sufficient solution

One job: produce one Technical Specification comparing credible options,
delivery shape, and effort. Do not finalize delivery topology or implement.

## Inputs

- Repository inputs and outputs are declared by `context` above.
- Conditional repository inputs are declared by `context.selectors` above.

Use bounded reads and inspect executable or verified external evidence only for
this decision. Do not load delivery issues, implementation branches, another
stage, or complete reference libraries.

## Process

1. Pin the Product Specification path and revision; assess every option ID for
   feasibility or technical selection.
2. Verify the current system and root cause; inventory existing owners,
   capabilities, assets, and data that could satisfy the outcome.
3. Compare the reuse or no-new-mechanism baseline with credible alternatives;
   estimate likely pull-request or slice shape, relative effort, migration,
   proof, operations, and uncertainty.
4. Investigate only until every criterion and material risk has a current owner
   with evidence or an explicit question, and further investigation would not
   change the credible options. For a prototype, preserve its isolation,
   evidence limits, findings, and disposition in Prototype Evidence.
5. When material architecture uncertainty blocks selection, frame one bounded
   Architecture Investigation. Obtain human approval for its question, scope,
   affected Projects or workstreams, evidence target, timebox, and stop
   condition before investigating. Findings are evidence, not product intent or
   implementation.
6. If evidence changes the preferred product behavior, challenge the preference
   with concrete cost, risk, ownership, migration, proof, or operational
   evidence, set `status: product-feedback`, and return to Understand. Design
   cannot select product behavior.
7. Send consequential unresolved reasoning to fresh-context adversarial review
   or human decision. Keep experiments isolated.
8. Define selected owners, boundaries, proof, migration, release, rollback,
   and monitoring. Use an ADR only for an earned durable decision; link
   investigation evidence instead of copying it.

## Outputs

- `../../../projects/<project-slug>/specs/technical-spec.md`
- After approval, its receipt under
  `../../../projects/<project-slug>/approvals/`
- Optional linked Prototype Evidence, Architecture Investigation, or ADR

## Human check

Approve exact specification revisions, assumptions, evidence, questions,
technical option, and delivery consequences. Approval admits delivery planning.
Product change returns to Understand, which owns selection.

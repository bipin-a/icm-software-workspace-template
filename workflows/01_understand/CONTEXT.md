---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Product behavior, Acceptance and proof, Open questions]
---

# 01_understand — Understand the problem and desired outcome

One job: establish the intended behavior, scope, and observable acceptance.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the brief sections named in frontmatter and the linked decision owners relevant to this stage. Bounded work does not require a Project.
- The user request, current product behavior, and only the domain or interface owners needed to resolve this outcome.

Do not load unrelated Projects, other stages, or complete reference libraries.

## Process

1. Establish the user's job, desired outcome, fixed constraints, scope, and material unknowns. Distinguish a suggested solution from an explicit constraint. Carry forward accepted selections; investigate only missing or changed facts.
2. Inspect existing behavior and its owners, reading exact applicable domain definitions. For unresolved intent that changes a source of truth or has several defensible user-visible shapes, compare credible behaviors and sacrifices. Otherwise stay with the clear approach and explain that choice.
3. For a UI-affecting outcome, follow [Interface evidence](references/interface-evidence.md). Initiate a preview when it resolves uncertainty and reconcile what it teaches into the accepted behavior.
4. Define observable acceptance and the smallest sufficient proof. Keep decisions in chat/PR; use a living Project brief only when durable coordination needs it.
5. Use bounded technical inspection or [Design](../02_design/CONTEXT.md) when feasibility can change the product decision. Carry the evidence back to this decision owner.

## Outputs

- Accepted intent, behavior, scope, and acceptance in chat/PR or the living brief.
- Relevant interface evidence and explicit questions that still affect the result.

## Human check

Reuse existing authority for clear work. Resolve material product choices or missing authority before dependent implementation. Continue to Design or Build when the needed decisions are already settled.

## Rules

This table is the only list of rules and references this stage loads. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-AGENT-PRESENTED-APPROVAL`; `RULE-RELEVANCE`; `RULE-SOURCE`; `RULE-CONTRADICTIONS` |
| [`document-review.md`](../../_shared/engineering/document-review.md) | `Review and change` |
| [`domain/CONTEXT.md`](../../_shared/domain/CONTEXT.md) | Conditional when the outcome depends on existing domain definitions: whole file |
| [`interface-evidence.md`](references/interface-evidence.md) | Conditional when the outcome changes a product interface or customer-facing provider flow: whole file |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for ICM document edits: `ICM artifact validation` |

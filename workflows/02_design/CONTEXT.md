---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions, Intent]
---

# 02_design — Choose the simplest sufficient solution

One job: choose technical owners and a proportionate delivery shape. Skip when the approach is settled and has no material trade-off.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the brief sections named in frontmatter and relevant linked decision owners. Bounded work needs no Project.
- The affected code, verified external facts, existing decisions, and material dependencies.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Pin accepted behavior and reuse root-cause and owner evidence. Inspect only changed code, stale facts, or unresolved questions; load exact applicable domain definitions.
2. Compare reuse with credible alternatives when consequences differ: effort, interfaces, migration, proof, operations, and uncertainty. Stop when more inspection would not change the choice. Apply the investigation limit before substantial work.
3. Record owners, invariants, proof, and relevant environment, migration, rollback, and monitoring obligations under Technical choices. An ADR or experiment must earn its place.
4. Keep one PR as the default. When several PRs are justified, define vertical outcomes, blockers, merge conditions, integration lifetime, combined proof, and human checkpoints under the multi-PR rules. Do not copy live status.
5. Complete coupled technical and delivery choices before presenting missing decisions together. Reuse authority; create dependent delivery objects only after the plan is agreed. Do not trade away accepted security, accessibility, integrity, or recovery obligations to reduce effort.
6. Return changed product behavior to Understand. Otherwise continue to Build within authority.

## Outputs

- Brief: Technical choices, or the same decisions in chat/PR; earned investigation or ADR links.

## Human check

Resolve missing authority for consequential technical and delivery choices together. Settled work needs no separate specification, Delivery Assessment, or intermediate approval.

## Rules

This table lists the rules this stage adds to the always-loaded set named in
`AGENTS.md` (voice, decision work, and principles); those still apply. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-PLAN-APPROVAL`; `RULE-PLAIN-DECISIONS`; `RULE-AGENT-PRESENTED-APPROVAL`; `RULE-RELEVANCE`; `RULE-ARCHITECTURE-DIRECTION`; `RULE-SOURCE`; `RULE-CALLER-MEANING`; `RULE-NO-INFERENCE`; `RULE-REPLACE-FIRST`; `RULE-CONTRADICTIONS` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional when replacing behavior or protection: `RULE-REMOVE-LEGACY`; `RULE-MEANINGFUL-DELETION` |
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | Conditional for data repair or migration: `RULE-CORRUPT-STATE`; `RULE-MIGRATION-OBJECT-PARITY` |
| [`document-review.md`](../../_shared/engineering/document-review.md) | `Review and change` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | `Earn each test`; `Prove the right cause at a stable boundary` |
| [`github-delivery-rules.md`](../../_shared/engineering/github-delivery-rules.md) | `Delivery profiles` |
| [`domain/CONTEXT.md`](../../_shared/domain/CONTEXT.md) | Conditional when a technical choice depends on domain definitions or ownership: whole file |
| [`prototype-evidence.md`](../../_templates/prototype-evidence.md) | Conditional when an isolated experiment is needed to distinguish options: whole file |
| [`architecture-investigation.md`](../../_templates/architecture-investigation.md) | Conditional when material architecture uncertainty needs a bounded investigation: whole file |
| [`adr.md`](../../_templates/adr.md) | Conditional when an accepted durable architecture decision needs a separate rationale: whole file |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for ICM document edits: `ICM artifact validation` |

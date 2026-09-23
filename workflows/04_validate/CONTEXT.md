---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Links]
  tools:
    - path: tools/icm/verify-candidate-receipt.mjs
      access: execute-only
---

# 04_validate — Review and prove the exact candidate

One job: review the candidate and gather terminal proof for acceptance and material risks.

## Inputs

- Current chat/PR decisions and authority. With a Project, use the brief sections named in frontmatter and relevant linked decision owners. Bounded work needs no Project.
- The exact base and head, complete diff, affected owners, review findings, proof obligations, and applicable environment and data identities.

Do not load unrelated Projects, stages, or complete reference libraries.

## Process

1. Pin candidate and decision revisions. Compare subsequent edits with the tested revision and repeat only affected proof.
2. Apply baseline review and triggered angles. Verify suspected defects at their owning seams. Record actionable findings using Finding format, or a clean review with coverage and omissions.
3. Route material findings needing a decision to Assess Readiness before proof that a required correction would invalidate. Review evidence does not authorize scope expansion.
4. For each criterion or coherent group, name distinguishing state, action, observable consequence, environment, data, and reset constraints. Use the narrowest meaningful check; add browser, lifecycle, migration, failure, security, or performance proof only when earned. Prove assembled behavior for combined delivery.
5. Establish whether accepted work or repository policy requires the full integration gate. If not, record a scoped N/A. If required, resolve premature corrections, use the configured canonical gate, and verify its receipt and terminal phases under Exact-candidate integration gate. Disabled configuration or PR prose cannot waive a required gate.
6. Record exact commands, candidate identity, terminal results, failures, skipped proof, fixture limitations, and material production differences. Report unrelated baseline failures separately.
7. Check acceptance coverage and the requested completion boundary. Continue to Assess Readiness when findings or a route decision remain; otherwise finish within authority or enter authorized Release. No additional artifact is needed to close validation.

## Outputs

- PR: review findings or clean review, criterion/risk evidence, required gate receipt or scoped N/A, and omissions; brief Acceptance and proof links to it.

## Human check

Confirm evidence is sufficient for the next action. Green checks do not establish readiness, merge authority, or release authority.

## Rules

This table is the only list of rules and references this stage loads. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-TEST-VALUE`; `RULE-DISCRIMINATING-TESTS`; `RULE-PUBLIC-CONTRACT`; `RULE-CONSEQUENCE-TESTS`; `RULE-CONTRADICTIONS`; `RULE-DIFF-TRUTH`; `RULE-WHOLE-TRUTH` |
| [`review-rules.md`](references/review-rules.md) | `Baseline review`; `Conditional angles`; `Finding format` |
| [`review-rules.md`](references/review-rules.md) | Conditional for ICM Markdown: `ICM Markdown review` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | `Earn each test`; `Prove the right cause at a stable boundary`; `Use the efficient proof sequence`; `Focused repository commands`; `Exact-candidate integration gate` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for tests: `Reuse test infrastructure without centralizing scenarios` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for lifecycle behavior: `Consider lifecycle states only when relevant` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for browser proof: `Local browser-test safety` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for ICM document edits: `ICM artifact validation` |
| [`github-delivery-rules.md`](../../_shared/engineering/github-delivery-rules.md) | `Checks and delivery truth`; `Traceability and human gates` |

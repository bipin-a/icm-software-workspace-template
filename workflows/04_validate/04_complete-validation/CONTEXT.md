---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Acceptance and proof, Links]
  references:
    - path: _shared/engineering/testing-rules.md
      headings: [Exact-candidate integration gate]
  tools:
    - path: tools/icm/verify-candidate-receipt.mjs
      access: execute-only
---

# 04_complete-validation — Complete the validation evidence

One job: establish what the candidate evidence covers and what remains unresolved.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact candidate, baseline and conditional reviews, criterion results, required gate evidence, findings, and skipped proof.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Read the proof scope from the owning PR. For scoped proof, verify coverage and an explicit full-gate N/A reason. For a required full gate, run the canonical receipt verifier under [Exact-candidate integration gate](../../../_shared/engineering/testing-rules.md#exact-candidate-integration-gate); do not load or reconstruct the execute-only tool or accept a failed receipt.
2. Verify each evidence item applies to the candidate. For reused focused proof, retain the original tested identity and explain why intervening changes do not affect it. The configured gate owner governs receipt reuse.
3. Check that all required review, criteria, material risks, and applicable gate results are represented. Pending proof remains incomplete; report missing or unavailable evidence.
4. Keep findings and their actual dispositions visible. Validation must not silently accept a defect or rewrite acceptance to fit the implementation.
5. Record the evidence and omissions on the owning PR, link it from the brief when present, and continue to [Assess Readiness](../../05_assess-readiness/CONTEXT.md).

## Outputs

- A candidate-specific account of completed validation, findings, and remaining obligations.

## Human check

Resolve material evidence gaps before a readiness claim. A complete report can include failures; reporting them does not accept the candidate.

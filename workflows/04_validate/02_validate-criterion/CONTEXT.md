---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof]
  references:
    - path: _shared/engineering/testing-rules.md
      headings: [Earn each test, Prove the right cause at a stable boundary, Use the efficient proof sequence, Focused repository commands]
---

# 02_validate-criterion — Prove the accepted behavior

One job: obtain meaningful evidence for a criterion or coherent group of criteria.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The exact candidate, selected criterion, owning proof seam, existing evidence, and applicable environment and data identity.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Name the criterion, distinguishing state, action, and observable consequence. Check whether existing proof remains applicable to this candidate.
2. Use the narrowest meaningful check. Add lifecycle, browser, migration, security, or performance proof only when acceptance or credible risk requires it.
3. Run the selected native repository commands. For combined delivery, prove the assembled behavior rather than relying only on child results.
4. Record exact commands, candidate identity, terminal results, omissions, and what the environment or fixtures do and do not prove.
5. Route a material failure for disposition. Continue remaining applicable proof; documentation-only work may record behavioral testing as not applicable.

## Outputs

- Criterion and risk evidence for the exact candidate, including failures and scoped omissions.

## Human check

Reuse agreed acceptance and proof obligations. Resolve material gaps or findings before claiming the outcome is established.

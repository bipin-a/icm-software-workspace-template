---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions]
---

# 01_choose-technical-design — Choose the simplest sufficient technical solution

One job: select the technical owners and approach that satisfy the accepted outcome.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The affected application code, executable configuration, and verified external facts needed for this decision.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Trace the current system and root cause. Identify existing capabilities, boundaries, data, and owners that can satisfy the outcome.
2. Choose the smallest sufficient approach. Compare alternatives only when their costs or consequences materially differ; include likely delivery effort, migration, proof, and operations.
3. Investigate until the decision has sufficient evidence. Apply the shared investigation limit before substantial work; a bounded experiment must answer a named question and have a stop condition.
4. Record owners, interfaces, proof, and relevant migration, release, rollback, or monitoring obligations under Technical choices or an earned linked decision document.
5. If feasibility changes intended behavior, return the evidence to [Understand](../../01_understand/CONTEXT.md). Resolve only the decisions affected by that evidence.

## Outputs

- A selected technical approach with its owners, reasons, material trade-offs, proof, and remaining uncertainty.

## Human check

Resolve consequential choices not covered by existing authority. A settled, bounded implementation does not need a separate Technical Specification or another approval round-trip.

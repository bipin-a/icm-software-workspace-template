---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions]
  selectors:
    - path: _shared/domain/CONTEXT.md
      when: a technical choice depends on domain definitions or ownership
    - path: _templates/prototype-evidence.md
      when: an isolated experiment is needed to distinguish technical options
    - path: _templates/architecture-investigation.md
      when: material architecture uncertainty needs a bounded investigation
    - path: _templates/adr.md
      when: an accepted durable architecture decision needs a separate rationale
---

# 01_choose-technical-design — Choose the simplest sufficient technical solution

One job: select the technical owners and approach that satisfy the accepted outcome.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The affected application code, executable configuration, and verified external facts needed for this decision.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Pin the applicable product decision and revision. Reuse established root-cause and owner evidence, including brief dispositions of rejected options. Read only exact applicable domain definitions.
2. Reinspect only changed code, stale external facts, or an unresolved question. Compare reuse with credible alternatives when their consequences differ, including delivery effort, migration, proof, operations, and uncertainty.
3. Stop when criteria and material risks have evidenced owners or explicit questions and further inspection would not change the options. Apply the shared investigation limit before substantial work. Use an earned isolated experiment, bounded architecture investigation, or human decision for consequential uncertainty.
4. Record owners, interfaces, proof, and relevant migration, release, rollback, or monitoring obligations under Technical choices or an earned linked decision document.
5. If feasibility changes intended behavior, return the evidence to [Understand](../../01_understand/CONTEXT.md). Resolve only the decisions affected by that evidence.
6. Complete any needed [delivery planning](../02_choose-delivery-shape/CONTEXT.md) before requesting remaining approval. Present coupled technical and delivery choices together, using existing evidence and authority.

## Outputs

- A selected technical approach with its owners, reasons, material trade-offs, proof, and remaining uncertainty.

## Human check

Resolve missing authority for consequential technical and delivery choices together. Reuse accepted selections and their original review source. A settled, bounded implementation needs no separate Technical Specification or intermediate approval round-trip.

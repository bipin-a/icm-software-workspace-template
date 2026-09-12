---
title: "Interpretable Context Methodology: reading notes"
type: methodology-reference
source: https://arxiv.org/abs/2603.16021
authors:
  - Jake Van Clief
  - David McDermott
accessed: 2026-08-23
status: reviewed
---

# Interpretable Context Methodology

Structured, paraphrased reading notes of the paper. This reference records the authors' method, reported observations, stated limitations, and proposed future directions. Project-specific interpretations and decisions belong elsewhere.

## Core claim

ICM is suitable for sequential, repeatable workflows where a human reviews meaningful intermediate outputs. In that setting, folder order can express stage order, Markdown or JSON files can carry handoffs, and a single agent can load only the context required by the current stage.

ICM moves orchestration for this class of workflow out of framework code and into an inspectable filesystem structure. Mechanical operations that do not need model judgment remain the responsibility of local scripts or external tools.

## Fitness test

Use an ICM pipeline when the work is:

- Sequential: later work consumes an earlier artifact.
- Reviewable: a person can inspect and correct the artifact between stages.
- Repeatable: the same process will run again with new input, such as for each POC or feature slice.

Do not expect ICM alone to handle:

- Real-time agent collaboration.
- High-concurrency application workloads.
- Automatic, complex branching based on model output.
- Production queues, state isolation, retries, authentication, or deployment infrastructure.

## Five context layers

| Layer | Typical artifact | Purpose |
|---|---|---|
| 0 | Global identity file such as `CLAUDE.md` | Answer where the agent is and identify the workspace. |
| 1 | Workspace-level `CONTEXT.md` | Route the requested task to the appropriate stage and shared resources. |
| 2 | Stage-level `CONTEXT.md` | Declare the stage's exact inputs, process, and outputs. |
| 3 | Stable references | Supply rules, conventions, templates, and domain knowledge that persist across runs. |
| 4 | Working artifacts | Carry the current run's inputs and intermediate outputs between stages. |

Layers 0-2 are a small catalog. Layers 3-4 hold the actual content. A stage should load only its contract, required references, and current working inputs.

## Stage contract

The paper defines a stage contract with three parts:

1. Exact inputs, distinguishing stable references from current-run artifacts.
2. One focused transformation or responsibility.
3. Named output artifacts written to an inspectable location.

The human review gate sits at the handoff boundary after the output is written and before the next stage consumes it. The reviewer can accept, edit, rerun, redirect, or abandon the work.

A folder is not a useful workflow stage merely because it represents an activity. It needs a focused contract and an output that another stage or person consumes.

## Human review findings

The paper reports an apparent U-shaped intervention pattern: practitioners edit heavily while setting direction, less during constrained middle stages, and heavily again when checking final alignment. The authors characterize early intervention as directional judgment and final intervention as alignment or debugging work.

The evidence is preliminary. The reported observations came from an invite-only, self-selected community; usage data was informal and self-reported; most use was concentrated in content production; testing used one model family; and no controlled comparison with monolithic prompting was conducted. Treat the method as a promising operating pattern, not a proven guarantee of better output.

## Architecture mechanics

- Folder numbering encodes execution order.
- Folder boundaries isolate concerns and scope the context delivered to the agent.
- Each stage's `output/` directory is the handoff surface for the next stage.
- Stable material belongs in reference or configuration locations; run-specific material belongs with working outputs.
- The stage Inputs table makes context selection explicit and auditable rather than leaving it to agent judgment.
- The filesystem represents intermediate state; no separate orchestration database is required for the workflow class being addressed.
- Plain-text artifacts make workspaces portable, diffable, versionable, and editable without framework-specific tooling.

## Working implementations described

The paper reports several implementations:

- A three-stage script-to-animation pipeline: research, script, and production.
- A five-stage course-deck pipeline: extraction, structural planning, slide drafting, visual specification, and assembly.
- A five-stage workspace builder: discovery, stage mapping, scaffolding, questionnaire design, and validation.

These examples surface intermediate representations before expensive downstream work. The course-deck example emphasizes reviewing the structural plan before drafting slides, when correction is still comparatively cheap.

## Observability and incremental execution

Because intermediate state is stored as readable files, the workflow is observable without a separate logging dashboard. A practitioner can inspect the current output, edit it, and rerun only the affected stage.

The paper compares this to multi-pass incremental compilation. Each stage transforms one representation into another, while declared inputs indicate which outputs may become stale when a source or reference changes.

## Source integrity

The authors distinguish between editing an output for a one-off improvement and correcting the source instructions or reference material that produced a recurring problem. Repeated output corrections are treated as diagnostic evidence that a stage contract or stable reference may need improvement.

The paper presents traceability as unfinished work. Current ICM workspaces expose intermediate state but do not automatically map a problematic output back to the exact instruction or source section that caused it.

## Future directions proposed

- Dependency-aware incremental reruns.
- Output provenance identifiers comparable to source maps.
- Cross-stage verification against earlier artifacts.
- Markdown breakpoints for inspecting partial stage execution.
- Detection of recurring human corrections that should become source-level improvements.

## Source sections used

- Sections 3.1-3.3: design principles, five-layer architecture, stage contracts, and handoffs.
- Section 4.4: workspace-builder sequence.
- Sections 4.5-4.6: practitioner observations and limitations.
- Sections 5.1-5.4: appropriate and inappropriate use cases.
- Sections 6.1-6.3: incremental reruns, semantic debugging, verification, and source integrity.

## Software workspace adaptation

The sections above describe the original paper, including numbered stages and
intermediate outputs. This template keeps seven numbered delivery stages and
their focused substeps, with scoped references and optional living Project
briefs. Stage outputs live in the owning chat/PR or brief; separate
specifications, approval receipts, and approval of every intermediate artifact
are not requirements here. Current human authority and the shared
[decision-work contract](../engineering/decision-work.md) govern execution.

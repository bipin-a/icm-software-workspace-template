---
type: workflow-stage
context:
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Intent, Technical choices, Acceptance and proof, Links]
---

# 07_learn — Apply earned learning to the right owner

One job: correct the canonical source when evidence supports a useful lasting improvement.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the brief sections named in frontmatter and the linked decision owners relevant to this stage. Bounded work does not require a Project.
- The exact implementation, validation, release, or workflow evidence that revealed the lesson, and the one source that may need correction.

Do not load unrelated Projects, other stages, or complete reference libraries.

## Process

1. Use Learn only when meaningful evidence earns a correction. It may be entered from any stage; stabilize active harm before documenting a lesson.
2. Explain expected behavior, what occurred, why the existing control failed, recurrence credibility, limitations, and remaining risk.
3. Classify the cause as Project, Factory, Input contract, Execution, or External change. Choose the canonical owner using [Learning rules](references/learning-rules.md). A lesson is evidence, not another policy source.
4. Apply an accepted correction within scope. New lasting guidance or cross-Project principles need human review; keep the evidence in the existing PR unless a separate record earns its place.
5. Check that the corrected owner is reachable through the task's route under [Decision work](../../_shared/engineering/decision-work.md). Record applicability and limits; structural checks do not prove better agent behavior. Separately agree any substantial behavioral trial.
6. Revisit only decisions and proof affected by the correction, then continue the requested outcome. A successful stage alone does not require a lesson document.

## Outputs

- An evidence-backed correction to its canonical owner, or a reason no source should change, with the relevant evidence linked.

## Human check

Reuse authority for an accepted correction. Human review is required before promoting new lasting guidance; a one-off execution mistake does not justify another permanent rule.

## Rules

This table lists the rules this stage adds to the always-loaded set named in
`AGENTS.md` (voice, decision work, and principles); those still apply. Load the
named headings, or the whole file where a row says so. Load a conditional row
only when its trigger applies.

| Source | Load only |
|---|---|
| [`safeguards.md`](../../_shared/engineering/safeguards.md) | `RULE-PLAIN-DECISIONS`; `RULE-RELEVANCE`; `RULE-SOURCE`; `RULE-REPLACE-FIRST`; `RULE-CONTRADICTIONS`; `RULE-WHOLE-TRUTH` |
| [`learning-rules.md`](references/learning-rules.md) | whole file |
| [`document-review.md`](../../_shared/engineering/document-review.md) | `Review and change` |
| [`testing-rules.md`](../../_shared/engineering/testing-rules.md) | Conditional for ICM document edits: `ICM artifact validation` |
| [`review-rules.md`](../04_validate/references/review-rules.md) | Conditional for ICM Markdown: `ICM Markdown review` |

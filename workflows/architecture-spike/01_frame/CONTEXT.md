# 01_frame — define the architecture question and hold

One job: produce an approved brief for one architecture uncertainty.

## Inputs

- Working: `../../../projects/<parent-project>/PROJECT.md`, or the named sponsor Project records
- Working: the current Product and Technical Specifications for those Projects
- Reference: `../references/spike-rules.md`
- Reference: `../../../_shared/principles/engineering-principles.md`
- Template: `../../../_templates/architecture-spike/spike-brief.md`

Read only candidate affected Projects whose boundaries plausibly intersect the question.

## Process

1. State the decision that is blocked and the evidence currently missing.
2. Confirm this is an evidence question rather than an independently valuable Project.
3. List candidate alternatives, affected Projects, boundaries, and workstreams.
4. Propose the narrowest justified hold scope, timebox, evidence, exclusions, and stop condition.
5. Set the sponsoring Project's `workflow_stage` to `architecture-spike/01_frame` and link the proposed spike.

## Outputs

- `../../../projects/<parent-project>/spikes/<spike-slug>/spike-brief.md`
- When no parent Project exists: `../../../architecture/spikes/<spike-slug>/spike-brief.md`

## Human check

Edit and approve the question, affected Projects, evidence threshold, and hold scope. Then record the approved hold and spike link in each affected Project before investigation begins.

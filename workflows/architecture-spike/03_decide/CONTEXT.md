# 03_decide — reconcile the architecture decision

One job: turn sufficient spike evidence into a human-approved decision and explicit routes for every affected Project.

## Inputs

- Working: the spike brief and findings under `../../../projects/<parent-project>/spikes/<spike-slug>/`, or `../../../architecture/spikes/<spike-slug>/` when no parent exists
- Working: the current specifications and Project records named by the brief
- Reference: `../references/spike-rules.md`
- Reference: `../../../_shared/architecture/decision-rules.md`
- Templates: `../../../_templates/architecture-spike/decision-summary.md` and `../../../_templates/adr.md`

## Process

1. Present the supported options, trade-offs, uncertainty, and recommendation.
2. Decide whether rationale is Project-local or cross-Project and whether it earns an ADR.
3. Draft the selected decision into each canonical Technical Specification and draft one ADR when earned.
4. Record each affected Project, invalidated artifact, required stage, hold disposition, and owner.
5. Link to spike evidence instead of copying it.
6. Mark all decision artifacts proposed until the human check.

## Outputs

- `../../../projects/<parent-project>/spikes/<spike-slug>/decision-summary.md`
- When no parent Project exists: `../../../architecture/spikes/<spike-slug>/decision-summary.md`
- Updated affected Technical Specifications
- Optional Project ADR under `../../../projects/<project-slug>/decisions/`
- Optional cross-Project ADR under `../../../_shared/architecture/decisions/`
- One linked entry in each affected Project's iteration log when that log exists

## Human check

Choose or edit the decision, approve its rationale and Project routes, then mark accepted artifacts accordingly, release or narrow the holds, and set every affected `workflow_stage` to its earliest invalidated lifecycle stage.

## Skill routing

- Use `documentation-and-adrs` when the decision earns an ADR.
- Use `doubt-driven-development` when the cross-Project impact or accepted risk remains contested.

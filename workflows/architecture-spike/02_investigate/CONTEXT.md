# 02_investigate — gather discriminating evidence

One job: produce enough evidence to choose among the approved alternatives without implementing the product change.

## Inputs

- Working: `../../../projects/<parent-project>/spikes/<spike-slug>/spike-brief.md`, or `../../../architecture/spikes/<spike-slug>/spike-brief.md` when no parent exists
- Working: only the code, specifications, and affected Project records named by the brief
- Reference: `../references/spike-rules.md`
- Reference when Python is in scope: `../../../_shared/engineering/python-tooling.md`
- Template: `../../../_templates/architecture-spike/findings.md`

Do not widen the question without returning to Frame.

## Process

1. Choose the smallest research, model, diagram, benchmark, or disposable prototype that distinguishes the alternatives.
2. Record exact sources, experiment artifacts, observations, and limitations.
3. Compare alternatives against the Project intention, affected boundaries, reversibility, migration cost, and credible future pressure.
4. Separate evidence from recommendation and identify any decision that remains human-owned.
5. Update the sponsoring Project's `workflow_stage` to `architecture-spike/02_investigate`.

## Outputs

- `../../../projects/<parent-project>/spikes/<spike-slug>/findings.md`
- When no parent Project exists: `../../../architecture/spikes/<spike-slug>/findings.md`
- Optional disposable experiment artifacts inside the same spike folder

## Human check

Confirm that the findings are accurate and sufficient for a decision, or edit the brief and repeat investigation.

## Skill routing

- Use `domain-modeling` for domain concepts, invariants, ownership, or lifecycle.
- Use `api-and-interface-design` for interface or boundary choices.
- Use `source-driven-development` for third-party technology claims.
- Use `prototype` for a disposable experiment.
- Use `doubt-driven-development` when the recommendation is consequential or uncertain.

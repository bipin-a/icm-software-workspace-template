# 06_release — release an approved candidate

One job: release the exact candidate approved by Assess Readiness.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/specs/technical-spec.md`
- Working: `../../projects/<project-slug>/delivery-assessment.md`
- Working: `../../projects/<project-slug>/summaries/validation-summary.md`
- Working: `../../projects/<project-slug>/summaries/readiness-decision.md`
- Working: the exact code or build identified by all current summaries
- Reference: `../../_shared/engineering/github-delivery-rules.md`
- Reference only when `delivery_profile: multi-pr`: `../../_shared/engineering/multi-pr-delivery.md`
- Template: `../../_templates/summaries/release-summary.md`

Do not copy live Git, CI, cloud, or database status from prior summaries. Re-check the system that owns each fact. Release cannot reinterpret findings or substitute a different candidate.

## Process

1. Confirm the candidate identifier matches the approved readiness decision and no applicable architecture hold remains.
2. Re-check the target environment, live gates, rollout plan, and rollback path.
3. For multi-PR delivery, confirm the integration pull request has satisfied its completion gates.
4. Obtain human authorization before external changes.
5. Release through staging and production as defined by the Technical Specification.
6. Verify the released behaviour and record the evidence links and final iteration.

## Outputs

- `../../projects/<project-slug>/summaries/release-summary.md`

## Human check

Confirm the released result and any remaining monitoring or rollback obligations.

## Skill routing

- Use `shipping-and-launch` to prepare and verify a production launch.
- Use `ci-cd-and-automation` when the delivery pipeline must change.
- Use `git-workflow-and-versioning` for branch, integration, and merge work.

Invoke a skill only when its condition is present.

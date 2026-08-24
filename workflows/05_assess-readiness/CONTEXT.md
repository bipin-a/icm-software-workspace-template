# 05_assess-readiness — decide the next route

One job: decide how to dispose of validation findings and whether the exact candidate is ready for Release. This stage does not change code or specifications.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/specs/product-spec.md`
- Working: `../../projects/<project-slug>/specs/technical-spec.md`
- Working: `../../projects/<project-slug>/delivery-assessment.md`
- Working: `../../projects/<project-slug>/summaries/build-summary.md`
- Working: `../../projects/<project-slug>/summaries/validation-summary.md`
- Reference: `references/readiness-rules.md`
- Reference: `../../_shared/voice.md`
- Template: `../../_templates/summaries/readiness-decision.md`

The build identifier in all current artifacts must match. If it does not, stop and return to Validate with the correct candidate.

## Process

1. Review each finding's evidence, contract relationship, and impact.
2. Choose a disposition and explain its local cost and relationship to the Project intention.
3. Decide one route: Build, Spec & Design, Architecture Spike, Assess Delivery, Validate, Roadmap, Defer, or Release.
4. Record the exact candidate, decision owner, rationale, accepted risks, and approval.
5. Update `PROJECT.md` to show the selected stage. Do not edit a specification merely to make it match the implementation.

## Outputs

- `../../projects/<project-slug>/summaries/readiness-decision.md`
- One compact row in `../../projects/<project-slug>/summaries/iteration-log.md`

## Human check

Approve the dispositions and route. Release is allowed only when the exact candidate is approved and no applicable architecture hold remains. A code fix returns to Build and creates a new candidate iteration. Changed intent returns to Spec & Design and invalidates the downstream assessment, build, validation, and readiness decision. Material unresolved architecture uncertainty routes to an architecture spike.

## Skill routing

- Use `doubt-driven-development` for contested or high-stakes readiness claims.
- Use `documentation-and-adrs` when accepting a material, durable architecture decision.

Invoke a skill only when its condition is present.

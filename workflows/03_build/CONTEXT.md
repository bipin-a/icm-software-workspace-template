# 03_build — implement the approved change

One job: implement the selected Project's approved specifications and delivery assessment.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/specs/product-spec.md`
- Working: `../../projects/<project-slug>/specs/technical-spec.md`
- Working: `../../projects/<project-slug>/delivery-assessment.md`
- Reference when relevant: `../../_shared/principles/engineering-principles.md`
- Reference when Python is in scope: `../../_shared/engineering/python-tooling.md`
- Reference: `../../_shared/engineering/testing-rules.md`
- Reference when creating commits or pull requests: `../../_shared/engineering/github-delivery-rules.md`
- Reference only when `delivery_profile: multi-pr`: `../../_shared/engineering/multi-pr-delivery.md`

Do not load brainstorms or unrelated Project histories unless an approved artifact links to them.

Conversation may select the Project, surface a concern, or request a route change. It is not authoritative product or technical intent. Every implemented behaviour must trace to the approved Product or Technical Specification. Existing code, tests, dependencies, and repository state remain implementation evidence.

If requested behaviour has no specification owner, stop and return to Spec & Design. The Delivery Assessment may shape sequencing and trade-offs but cannot define behaviour.

If an applicable `architecture_hold` is unresolved, stop. Build must not work around the blocked boundary.

If implementation reveals a material data, interface, ownership, migration, or third-party uncertainty that the approved specifications and Delivery Assessment did not address, stop and route to the architecture-spike workflow when evidence is needed. Otherwise return to Spec & Design or Assess Delivery. Do not add speculative abstractions during Build.

## Process

1. Confirm the specifications and delivery assessment are approved and the delivery profile is decided.
2. For multi-PR delivery, select an approved, unblocked child issue.
3. Check what existing tests already prove.
4. Implement the smallest complete change.
5. Add only the focused tests earned by the behaviour or risk.
6. Increment the Project iteration and assign an exact commit, build, or artifact identifier to `current_build`.
7. Clear Project links to validation and readiness summaries from the prior candidate; their compact decision history must already be in the iteration log.
8. Record what changed, its specification trace, exact test commands and results, skipped checks, and what remains.

## Outputs

- Application code in the path selected by the Technical Specification
- `../../projects/<project-slug>/summaries/build-summary.md`
- For multi-PR delivery: child pull request evidence and the updated draft integration pull request

Use `../../_templates/summaries/build-summary.md`. Replace stale candidate summaries only after their decisions and evidence links are represented in `iteration-log.md`.

## Human check

Inspect the implemented change and build summary. Accept it for validation or route the Project back to Spec & Design, Assess Delivery, Build, or an architecture spike.

## Skill routing

- Use `incremental-implementation` for changes across several files or boundaries.
- Use `test-driven-development` for new behaviour or a defect fix.
- Use `frontend-ui-engineering` for a user interface implementation.
- Use `api-and-interface-design` for a public API or module boundary.

Invoke a skill only when its condition is present.

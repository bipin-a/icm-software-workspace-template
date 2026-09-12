---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
  references:
    - path: _shared/engineering/document-review.md
---

# Feature work

One job: carry an outcome through decisions, implementation, and sufficient proof.

## Inputs

The manifest applies to a selected Project. Without one, use conversation/PR
context and the named profile; do not create a brief to satisfy an input path.

- Current conversation and existing explicit authority
- For a selected Project: `projects/<project-slug>/PROJECT.md` and only the
  decision documents it names for the current question
- Shared behavior: `../../_shared/engineering/decision-work.md`
- Engineering profile: `../../_shared/engineering/profiles/direct-repository.md#direct-repository`
- Review: `../../_shared/engineering/document-review.md`
- Template when durable coordination is needed: `../../_templates/project/PROJECT.md`

Do not load unrelated Projects or complete reference libraries. No numbered
artifact handoffs or separate approval receipts are required.

## Process

1. **Work through the decisions.**
   - Use the shared decision loop. Keep bounded work in chat and the PR.
   - Use a Project brief when durable coordination is needed. Carry forward
     existing decisions; do not create a second brief.
2. **Resolve uncertainty.**
   - Revisit Product behavior, technical choices, or proof as evidence requires.
   - Initiate a small UI preview early when interaction is uncertain.
   - Technical inspection and feasibility feedback may happen during discovery.
3. **Build with sufficient evidence and authority.**
   - Use existing owners, the smallest sufficient proof, and applicable safeguards.
   - Record results and commands in the PR; keep decision prose stable.
4. **Add work ordering or release details only when they change a decision.**
   - Relevant cases: dependencies, multiple PRs, migration, rollout, rollback,
     or human checkpoints.
   - Keep details in the brief/PR unless a separate coordination plan earns its place.
   - Mermaid is optional. One PR needs no Delivery Assessment or diagram.
5. **Coordinate several PRs when needed.**
   - Use the applicable sections of `../../_shared/engineering/multi-pr-delivery.md`.
   - Name the exact plan and source of its authority.
   - GitHub owns changing dependencies, status, and checks.
6. **Review and verify the exact candidate.**
   - Apply the profile's finding guidance before adopting proposed fixes.
   - Provide focused criterion/risk evidence. Independently required full gates
     and release safeguards still apply.
   - Required full gate: use `../../_shared/engineering/testing-rules.md#exact-candidate-integration-gate`.
   - Authorized release: use `references/release-rules.md` and the configured
     provider procedure.
   - Those owners retain their commands, proof, finding dispositions, and
     release authority.
7. **Finish the requested outcome.**
   - Apply earned learning to its canonical owner.
   - Separately agree any substantial behavioral trial.

## Outputs

- Working change and relevant proof on the owning PR
- One living Project brief only when durable coordination needs it
- Original review authority and exact revisions linked from the brief/PR

## Human check

- Inspect unresolved material choices or the completed result, within the scope
  requested.
- Use the shared investigation limit and document-review contract.
- Do not require approval of every intermediate artifact or infer approval from document
  metadata.
- Release requires the applicable explicit authority.

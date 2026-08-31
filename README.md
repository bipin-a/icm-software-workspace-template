# ICM Software Workspace Template

A reusable software-delivery profile built on
[Interpretable Context Methodology](https://arxiv.org/abs/2603.16021). This is
the first formal profile release: one human-gated Project workflow, durable
artifact ownership, scoped shared context, and explicit boundaries for live
delivery and deployment state.

See [`CHANGELOG.md`](CHANGELOG.md) for version history and
[`MIGRATION.md`](MIGRATION.md) when updating an unversioned instance.

This repository is a factory starter, not a finished product repository.
Instantiate it, complete the setup questionnaire once, and let each Project
carry its own product and technical intent.

## Core model

[`workflows/`](workflows/CONTEXT.md) holds one shared Pipeline.
[`projects/`](projects/CONTEXT.md) holds stable Project records that move through
that Pipeline without moving folders or copying workflow instructions.

A Project is the smallest durable unit that owns one product outcome. It is not
the same as a conversation, issue, pull request, prototype, investigation, or
release. One Project may use several of those and may return to an earlier stage
when evidence invalidates an accepted artifact.

The normal path is:

1. **Understand** — approve the problem, product behavior, scope, acceptance,
   and applicable interface evidence.
2. **Design** — choose the technical design and its proportionate delivery
   shape.
3. **Build** — implement the accepted artifacts.
4. **Validate** — review and prove the exact candidate.
5. **Assess Readiness** — dispose findings and choose the next route.
6. **Release** — promote and verify one approved candidate by environment.
7. **Learn** — apply an earned lesson to its canonical owner.

Stage order is a default, not permission to infer state. The selected Project's
exact artifacts, approval evidence, and current external delivery owners decide
the next valid action.

## Durable context and live state

Repository files own durable intent, contracts, decisions, and links. Git and
pull-request systems own implementation history and changing delivery state;
configured approval surfaces own approval events; CI owns check results; and
deployment providers own live environment state.

Project records link those systems without copying their status. Approval and
candidate evidence bind to exact artifact or Git identities so a changed input
cannot silently reuse stale evidence.

## Workspace boundaries

| Path | Responsibility |
|---|---|
| [`setup/`](setup/CONTEXT.md) | Configure the stable factory, repository commands, and human approval owners. |
| [`workflows/`](workflows/CONTEXT.md) | Define the shared lifecycle, stage contracts, and human gates. |
| [`projects/`](projects/CONTEXT.md) | Hold one stable record and earned artifacts for each product outcome. |
| [`architecture/`](architecture/CONTEXT.md) | Hold cross-Project investigation evidence only when no Project is its natural owner. |
| [`roadmap/`](roadmap/CONTEXT.md) | Hold future product directions that are not accepted Projects. |
| [`_shared/`](_shared/CONTEXT.md) | Own stable cross-Project references, profiles, principles, and safeguards. |
| `_templates/` | Provide blank artifact shapes; templates do not prove an artifact exists or is approved. |
| [`app/`](app/README.md) | Reserve the application boundary until setup or an accepted Technical Specification selects the real source layout. |

Context stays scoped. Root and parent `CONTEXT.md` files route; working contracts
name exact Project inputs, templates, and shared profile sections. Do not load
the whole workspace merely because it is available.

## Configure a new instance

1. Create a repository from this template or copy it into an empty repository.
2. Open [`setup/questionnaire.md`](setup/questionnaire.md).
3. Follow [`setup/CONTEXT.md`](setup/CONTEXT.md) and write each accepted answer
   to its named canonical owner.
4. Configure the artifact-approval owner, existing repository commands, GitHub
   policy, and any live settings. When the complete candidate gate depends on a
   later Technical Specification, record its exact pre-Build trigger and owner
   instead of inventing a command during setup.
5. Create the first Project only after the human approves the consolidated
   factory configuration.

The template has one optional maintenance check:

```sh
node tools/icm/check-context-budget.mjs
```

[`icm.config.json`](icm.config.json) owns only context bounds and representative
budget scenarios. Each instantiated repository owns its actual test, approval,
candidate-gate, and deployment commands. Build cannot hand a candidate to
Validate until the applicable Technical Specification names complete proof.

For an existing repository, inventory and classify the current tree first.
Treat this profile as a target reference, not a directory to copy wholesale
over working code. Existing code, history, product intent, commands,
infrastructure, and live settings remain authoritative until an approved
migration names their successors.

## Product and stack neutrality

The source template contains no sample Project, provider credentials, live
setting claims, or selected application stack. `app/`, `roadmap/`, and
`architecture/` are intentional instantiation surfaces. Optional stack shelves
remain conditional and never override a Project Technical Specification.

Product and UX principles stay in their shared owners when they are broadly
applicable. Project-specific behavior, brand voice, technology, hosting, data,
interfaces, and deployment choices belong to setup outputs or the applicable
Project artifacts.

## Maintain the template

Leave `setup/questionnaire.md` incomplete in this source repository. Before a
release, verify the cold-agent setup walk, Project selection walk, local links,
workflow and profile routing, retired-path absence, context budgets, and lack of
instance data.

## License and attribution

Released under the [MIT License](LICENSE). The profile builds on
[Interpretable Context Methodology](https://arxiv.org/abs/2603.16021) by Jake
Van Clief and David McDermott and was informed by the MIT-licensed
[`icm-architect`](https://github.com/RinDig/icm-architect) skill.

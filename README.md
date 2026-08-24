# ICM Software Workspace Template

A reusable software-delivery profile built on [Interpretable Context Methodology](https://arxiv.org/abs/2603.16021). It combines a sequential, human-gated Pipeline with lightweight Project records, an architecture-spike interrupt, shared factory rules, and blank working-artifact templates.

This repository is a factory starter, not a finished product repository. Instantiate it, configure it once, and let each Project carry its own product and technical intent.

## Why this exists

The ICM paper defines a general method for sequential, human-reviewed work, and [`icm-architect`](https://github.com/RinDig/icm-architect) can derive many kinds of ICM workspace from a described or existing process. Software repositories still need a concrete lifecycle, durable decision owners, delivery controls, and evidence requirements. Re-deriving those choices for every repository wastes setup effort and makes similar repositories behave differently.

This template packages one opinionated software-delivery profile. It is more specific than the general method and skill, but remains product-, stack-, provider-, and deployment-neutral until its setup questionnaire is completed.

## The core design: one Pipeline over Project records

`icm-architect` defines both Pipeline and Record library forms and allows forms to compose. This template makes one specific composition the default for software work: [`workflows/`](workflows/) holds one shared Pipeline, while [`projects/`](projects/CONTEXT.md) holds durable Project records that move through it.

A Project is the smallest durable unit that owns a product outcome. It is not synonymous with a conversation, task, issue, pull request, prototype, or architecture spike. One Project may require several of those, repeat Build and validation, and route back when evidence changes the intended result.

Each Project stays at one stable path. Its [`PROJECT.md`](_templates/project/PROJECT.md) records identity, intent, current workflow stage, candidate iteration, delivery shape, architecture holds, and links to the canonical artifacts. Shared workflow stages read and update that record; Projects do not copy the workflow or move between stage folders.

A Project folder grows only as its work earns artifacts:

```text
projects/<project-slug>/
├── PROJECT.md
├── specs/
├── prototypes/
├── spikes/
├── decisions/
├── delivery-assessment.md
├── summaries/
└── lessons.md
```

This stable entity gives product intent, technical intent, delivery evidence, and decision history one durable custodian across multiple implementation attempts and pull requests.

## Purpose-built workspace boundaries

[`AGENTS.md`](AGENTS.md) is the canonical directory and agent-routing map. The folders are separated for these architectural reasons:

| Folder | Boundary it protects |
|---|---|
| [`setup/`](setup/CONTEXT.md) | Configures the stable repository factory once without inventing Project-specific answers. |
| [`workflows/`](CONTEXT.md) | Defines shared lifecycle transitions once instead of copying a process into every Project. |
| [`projects/`](projects/CONTEXT.md) | Gives each durable product outcome one record and one home for its working artifacts. |
| [`architecture/`](architecture/CONTEXT.md) | Holds cross-Project architecture evidence only when no Project is its natural custodian. |
| [`roadmap/`](roadmap/CONTEXT.md) | Keeps plausible future directions visible without treating them as approved specifications. |
| `_shared/` | Owns stable cross-Project factory rules and knowledge so Projects link instead of duplicate. |
| `_templates/` | Defines blank, copyable shapes for records and artifacts without mixing method with instance data. |
| [`app/`](app/README.md) | Keeps production code separate from workflow records while allowing the chosen technical structure to replace this placeholder. |

## What this profile adds beyond `icm-architect`

Compared with the generic `icm-architect` skill, this template supplies:

- The Project-centered Pipeline and folder boundaries described above.
- A fixed, reversible lifecycle from aligned specifications through delivery assessment, Build, Validate, readiness, Release, and Learn.
- A one-time factory questionnaire that writes accepted decisions to canonical owners and leaves evidence-dependent choices to be earned later.
- A Spec & Design contract that uses the least expensive faithful interface evidence before new backend boundaries are committed for human-facing behavior. It can reuse an existing frontend or create isolated prototype evidence.
- An architecture-spike interrupt with explicit holds, evidence custody, decision records, and routing back to the earliest invalidated stage.
- Delivery-shape assessment, pull-request hygiene, environment and test-data planning, exact-candidate validation, readiness disposition, release evidence, and source-level learning rules.
- Explicit routing for discussions, diagnosis, and research so they remain conversational until they create a durable consequence.

These are profile choices built on ICM, not additions to or replacements for the underlying methodology.

## How the layers relate

| Layer | Responsibility |
|---|---|
| [ICM paper](https://arxiv.org/abs/2603.16021) | Foundational principles for folder structure as agent architecture. |
| [`icm-architect`](https://github.com/RinDig/icm-architect) | Generic Build and Restructure modes, six composable forms, starter contracts, and the walk test. |
| This template | A reusable, opinionated ICM profile for software Project delivery. |
| An instantiated repository | One product's configured rules, specifications, code, evidence, and delivery history. |

## Choose the adoption route

Build and Restructure are adoption-time modes supplied by `icm-architect`; they are not permanent stages in an instantiated repository. After setup, agents use only the Project lifecycle routed by `CONTEXT.md`.

### New repository

Create a new repository from this template or copy it into an empty local repository. Then follow [`setup/CONTEXT.md`](setup/CONTEXT.md) and complete the factory questionnaire before creating the first Project.

Use the generic [`icm-architect`](https://github.com/RinDig/icm-architect) Build mode instead when the real workflow differs materially from this software-delivery profile. Do not force these stages onto a process with different human pauses or outputs.

### Existing repository

Use `icm-architect` Restructure mode. Inventory and classify the existing tree, propose a migration map for human approval, and only then adapt this profile on a branch. Treat this template as a target reference, not as a directory to copy wholesale over working code.

The existing repository remains authoritative for code, history, product intent, executable commands, infrastructure, and live settings. Preserve its entry instructions and reconcile them into one routing source rather than maintaining competing files.

## What setup must decide

[`setup/questionnaire.md`](setup/questionnaire.md) is the canonical setup decision list and output map. It also identifies choices that must be earned later instead of invented during setup.

## Maintaining the template

Keep `setup/questionnaire.md` incomplete in this source repository so generated copies enter setup. Do not add a sample Project, product-specific identity, provider credentials, or live-setting claims. Validate the cold-agent walk, local links, stage contracts, and instance-data scan before publishing changes.

## License and attribution

Released under the [MIT License](LICENSE). The profile builds on [Interpretable Context Methodology](https://arxiv.org/abs/2603.16021) by Jake Van Clief and David McDermott and was informed by the MIT-licensed [`icm-architect`](https://github.com/RinDig/icm-architect) skill.

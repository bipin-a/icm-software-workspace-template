# ICM Software Workspace Template

A reusable software-delivery profile built on [Interpretable Context Methodology](https://arxiv.org/abs/2603.16021). It combines a sequential, human-gated Pipeline with lightweight Project records, an architecture-spike interrupt, shared factory rules, and blank working-artifact templates.

This repository is a factory starter, not a finished product repository. Instantiate it, configure it once, and let each Project carry its own product and technical intent.

## Choose the adoption route

Build and Restructure are adoption-time modes supplied by `icm-architect`; they are not permanent stages in an instantiated repository. After setup, agents use only the Project lifecycle routed by `CONTEXT.md`.

### New repository

Create a new repository from this template or copy it into an empty local repository. Then follow [`setup/CONTEXT.md`](setup/CONTEXT.md) and complete the factory questionnaire before creating the first Project.

Use the generic [`icm-architect`](https://github.com/RinDig/icm-architect) Build mode instead when the real workflow differs materially from this software-delivery profile. Do not force these stages onto a process with different human pauses or outputs.

### Existing repository

Use `icm-architect` Restructure mode. Inventory and classify the existing tree, propose a migration map for human approval, and only then adapt this profile on a branch. Treat this template as a target reference, not as a directory to copy wholesale over working code.

The existing repository remains authoritative for code, history, product intent, executable commands, infrastructure, and live settings. Preserve its entry instructions and reconcile them into one routing source rather than maintaining competing files.

## Runtime shape

[`AGENTS.md`](AGENTS.md) is the canonical directory map. [`CONTEXT.md`](CONTEXT.md) is the canonical lifecycle and task router. The runtime is a Pipeline operating on Project records, with an architecture-spike interrupt for consequential uncertainty.

## What setup must decide

[`setup/questionnaire.md`](setup/questionnaire.md) is the canonical setup decision list and output map. It also identifies choices that must be earned later instead of invented during setup.

## Method and profile

The ICM paper supplies the foundational method. `icm-architect` supplies generic Build and Restructure behavior. This repository supplies one opinionated software-delivery profile. Instantiated product repositories remain separate from all three.

## Maintaining the template

Keep `setup/questionnaire.md` incomplete in this source repository so generated copies enter setup. Do not add a sample Project, product-specific identity, provider credentials, or live-setting claims. Validate the cold-agent walk, local links, stage contracts, and instance-data scan before publishing changes.

## License and attribution

Released under the [MIT License](LICENSE). The profile builds on [Interpretable Context Methodology](https://arxiv.org/abs/2603.16021) by Jake Van Clief and David McDermott and was informed by the MIT-licensed [`icm-architect`](https://github.com/RinDig/icm-architect) skill.

# ICM Software Workspace Template

A reusable workspace for taking software work from intent through decisions,
implementation, review, and proof. It uses scoped context, useful initiative,
one owner per decision, and proportionate work.

The template has no release-version lifecycle, changelog, upgrade framework, or
instance version field. Git continues to hold changes and the exact revisions
used for review and proof.

## How work runs

- **Bounded work:** keep the request, material choices, implementation, and proof
  in chat and the PR. Clear intent and known owners do not need a Project.
- **Coordinated work:** use one living
  [`PROJECT.md`](_templates/project/PROJECT.md) when unresolved product,
  architecture, ownership, or work-order decisions need durable planning.
- **Evidence changes a decision:** revisit that decision and its dependent
  proof. Continue authorized work; intermediate documents are not completion.
- **Review:** chat or the PR owns human authority. Compare the current decision
  documents with the exact reviewed revision before reusing that review.
- **Proof:** use focused checks for the actual change and risk. A full integration
  gate or release procedure applies when the work requires it.

Start with [`AGENTS.md`](AGENTS.md), then select the exact route in
[`CONTEXT.md`](CONTEXT.md). The [delivery workflow](workflows/CONTEXT.md#stages)
keeps seven stages: Understand, Design, Build, Validate, Assess Readiness,
Release, and Learn. Each works with chat/PR context or a selected Project brief.
Enter only the stages the work needs, each with one contract and explicit rule
selections. A clear fix can start at Build and Validate; carry existing authority
and evidence forward.

## Start a new repository

1. Create a repository from this template.
2. Follow [`setup/CONTEXT.md`](setup/CONTEXT.md) and complete the
   [`questionnaire`](setup/questionnaire.md) using existing decisions first.
3. Write each answer to its named owner. Establish only what is needed now;
   leave stack, provider, and runtime choices with their explicit later trigger.
4. Review the consolidated setup. Mark it complete after applicable checks and
   authorized live-setting verification.
5. Start with bounded work or create one Project when coordination needs it.

No application stack, cloud provider, domain, sample Project, or external service
has been selected. [`app/`](app/README.md) is a source-layout route, not an app
scaffold. Existing repositories should preserve their code and owners and adapt
only the relevant workspace contracts through a reviewed diff.

## Workspace map

| Path | Owns |
|---|---|
| [`setup/`](setup/CONTEXT.md) | One-time configuration and completion state |
| [`workflows/`](workflows/CONTEXT.md) | Seven stage contracts and their evidence procedures |
| [`projects/`](projects/CONTEXT.md) | Living briefs and earned decision documents |
| [`_shared/`](_shared/CONTEXT.md) | Shared rules, principles, domain references, and context selection |
| [`_templates/`](_templates/project/PROJECT.md) | Optional blank artifact shapes |
| [`architecture/`](architecture/CONTEXT.md) | Investigation evidence with no natural Project owner |
| [`roadmap/`](roadmap/CONTEXT.md) | Future directions outside accepted work |
| [`app/`](app/README.md) | The application source-layout boundary |
| `extras/team-delivery/` | Team-size rules and tools; removed by solo setup |

Repository documents own durable intent and links. GitHub owns live delivery
state; checks and deployment providers own their results. Do not copy live
status into briefs or infer approval from a document, green check, or branch.

## Workspace tools

The tools use Node.js built-ins and require no package installation:

```sh
npm --prefix tools/icm run check
npm --prefix tools/icm test
npm --prefix tools/icm run check -- --project <slug>
npm --prefix tools/icm run check -- --project <slug> --reviewed-commit <full-sha>
npm --prefix tools/icm run context -- AGENTS.md CONTEXT.md _shared/voice.md
```

The checker validates stage routes, stage-owned rule selections, local links, living briefs,
and the canonical human-call skill and its Claude adapter.
Revision comparison includes working and staged decision documents. It detects
change; it cannot establish human approval or classify editorial wording.

[`icm.config.json`](icm.config.json) owns the repository size and the
advisory context-size estimate.

## Choose a size

Setup asks one question first: is this repository **solo** or **team**?

| Size | Stages | Team kit |
|---|---|---|
| Solo: one person, one PR at a time, no deployment pipeline (a take-home, spike, or script) | Understand, Design, Build, Validate, Learn | Removed |
| Team: several PRs, a full candidate gate, or deployments | All seven | Kept |

```sh
npm --prefix tools/icm run setup -- --size solo
npm --prefix tools/icm run setup -- --size team
```

Solo setup deletes `extras/team-delivery/`, the Assess Readiness and Release
stages, and the `to-tickets` skill. It cannot be undone in place; choose team
when unsure. The checker then enforces the chosen size.

## Team delivery kit

`extras/team-delivery/` holds what only a team needs. Its `rules.md` adds rows
to the stages it applies to, so a solo copy carries none of it:

- Multi-PR coordination and generated delivery views, with GitHub metadata as
  their live owner. Preview is read-only; publishing is explicit.
- The optional full candidate gate and its receipt verifier. The gate is
  disabled in `icm.config.json` until real application phases are configured.
  It is machine proof, separate from human review of decisions.
- Changed-file checks: `node tools/icm/workspace-check.mjs --changed-since <commit>`
  selects affected Project documents and incoming references.
- The `to-tickets` skill, which prepares slices for several PRs.

The core keeps [integration review](.agents/skills/integration-review/SKILL.md)
and [context packets](_shared/engineering/context-packets.md), which assemble
declared criterion, environment, and prerequisite sections without silently
dropping required text to fit a size target.

For an existing repository, adopt these through a reviewed diff while preserving
its code and decision owners. Configure real proof commands before using the
candidate gate; choose the integration mode and actual GitHub objects before
using delivery views. Add context selectors only when the living brief needs
them. This template does not migrate existing repositories or support older
specification/approval-receipt Project formats.

## Maintain this template

Leave the setup questionnaire incomplete. Check the setup and Project-selection
routes, run the tooling tests and workspace check, and review the diff for
product-specific commands, domain rules, credentials, data, or live-state claims.
Template prompts belong only in setup or optional starters; remove them from
instantiated decision documents. Structural checks do not evaluate agent judgment.

## License and attribution

Released under the [MIT License](LICENSE). The workspace builds on
[Interpretable Context Methodology](https://arxiv.org/abs/2603.16021) by Jake
Van Clief and David McDermott and was informed by the MIT-licensed
[`icm-architect`](https://github.com/RinDig/icm-architect) skill.
The [methodology notes](_shared/methodology/interpretable-context-methodology.md)
distinguish the original staged method from this software-work adaptation.

The optional [Firstmate assessment](_shared/engineering/evidence/firstmate-decision-escalation-2026-09-14.md)
records the dated source ideas behind human-call and the mechanisms not adopted.
Read it when evaluating that design; it is not part of normal agent context.

# Factory setup

One job: configure the stable repository factory before the first Project begins.

## Inputs

- Working: `questionnaire.md`
- Working for an existing repository: the verified repository tree, current entry instructions, Git history, and live GitHub settings
- Reference: `../_shared/methodology/interpretable-context-methodology.md`
- Reference: `../README.md`

## Process

1. Confirm whether this is a new repository or an approved Restructure-mode adaptation of an existing repository.
2. Ask the required questionnaire decisions one at a time. Offer a concrete recommendation when repository evidence supports one.
3. Write each accepted answer to its canonical owner named in the questionnaire; do not store a second answer copy here.
4. Leave evidence-dependent choices with their named trigger and owner instead of inventing defaults.
5. Review one consolidated diff with the human.
6. Apply any approved live GitHub settings, verify them from GitHub, then set the questionnaire status to `complete`.

## Outputs

- Configured human-facing identity, root agent identity, and routing
- Configured files under `../_shared/`
- Verified GitHub delivery policy when GitHub is in scope
- `status: complete` in `questionnaire.md`

## Human check

Review the consolidated factory configuration, live-setting evidence, and intentionally later choices. Approve the factory before the first Project is created.

---
type: factory-setup-contract
status: active
---

# Factory setup

One job: configure and verify the stable repository factory before the first
Project begins.

## Inputs

- Working: [`questionnaire.md`](questionnaire.md)
- For an existing repository: the verified source tree, entry instructions,
  executable commands, Git history, and live delivery and deployment settings
- Reference: the [ICM methodology notes](../_shared/methodology/interpretable-context-methodology.md)
- Reference: the [profile README](../README.md)

## Process

1. Confirm whether this is a new repository or an approved adaptation of an
   existing repository. Inventory existing owners before proposing replacements.
2. Ask the required questionnaire decisions one at a time. Offer a concrete
   recommendation only when repository or live-system evidence supports it.
3. Write each accepted answer to the canonical owner named in the questionnaire.
   Keep only ownership and completion state here.
4. Configure the application source route, shared reference catalog, engineering
   profiles, safeguards, testing entry commands, GitHub delivery rules, and
   [`../icm.config.json`](../icm.config.json).
5. Configure the `artifact-receipts` approval contract that binds approval
   evidence to an exact Git blob identity. Verify it with
   `node tools/icm/check-workspace.mjs`; a receipt file alone is not approval or
   enforcement.
6. When executable repository checks already exist, configure one exact-
   candidate gate command, its clean-worktree preconditions, receipt location,
   and verifier. The stable entry commands are
   `node tools/icm/candidate-gate.mjs` and
   `node tools/icm/verify-candidate-receipt.mjs`. Otherwise keep the gate
   disabled in `icm.config.json` and record the exact later trigger and owner;
   Build must not begin until the selected Technical Specification configures
   and verifies it.
7. Leave stack, provider, environment, and product decisions with their named
   later trigger and owner when current evidence cannot decide them.
8. Review one consolidated repository diff with the human.
9. Apply approved live settings, read them back from their owning systems, and
   record verification evidence without copying their changing status.
10. Set the questionnaire status to `complete` only after the human approves the
    factory, controls applicable during setup are verified, and every deferred
    control has one named trigger and owner.

## Outputs

- Configured repository identity, root instructions, routing, and source layout
- Configured shared catalogs, principles, safeguards, and engineering profiles
- Executable artifact-approval controls and either a verified exact-candidate
  gate or its named pre-Build trigger and owner
- Verified repository, GitHub, proof, and release policy
- `status: complete` in `questionnaire.md`

## Human check

Review the consolidated configuration, executable-control evidence, verified
live settings, and deliberately later choices. Approve the factory before the
first Project is created.

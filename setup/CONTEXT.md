---
type: factory-setup-contract
status: active
---

# Workspace setup

One job: establish enough shared context to begin useful work in a new instance.
Template maintenance leaves the questionnaire incomplete.

## Inputs

- [Questionnaire](questionnaire.md) and existing human decisions
- [README](../README.md), current source tree, entry instructions, and executable configuration
- Existing repository and external settings when adapting an established project

## Process

1. Identify the workspace, intended outcome, and existing canonical owners.
2. Reuse current answers. Ask only unresolved questions that change setup;
   group related questions when practical. Routine inspection may proceed.
3. Write accepted answers to the questionnaire's canonical output map. Keep
   completion state here, without a duplicate answer set.
4. Select real source paths, applicable constraints, decision owners, and
   review surfaces. Keep the default bounded-task/feature-brief workflow.
5. If executable work exists, verify its native dependency and proof commands.
   Configure a full candidate gate only when the required proof needs it.
6. Defer unavailable stack or provider decisions to the first feature that
   requires them. Record the trigger and owner in the relevant canonical file;
   do not invent commands, credentials, or application code.
7. Run the workspace check and relevant tooling tests. Walk from the root to
   setup, bounded work, and a selected Project without loading unrelated context.
8. Present the concrete consolidated setup diff. Apply only authorized live
   settings and read back the result. A local setup does not require deployment.
9. Mark the questionnaire complete when the human accepts the setup and the
   applicable verification is complete.

## Outputs

- Configured identity, source routes, decision owners, and shared constraints
- Verified applicable commands and live settings, with evidence in chat/PR
- Explicit triggers and owners for deferred choices
- Questionnaire completion state

## Human check

Review material unresolved choices and the consolidated result. Reuse existing
explicit authority; do not require approval of each intermediate file.

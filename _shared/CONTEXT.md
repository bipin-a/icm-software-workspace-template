---
type: shared-reference-router
status: active
---

# Shared factory references

This folder holds stable references that may constrain more than one Project.
Load only the owner named by the current workflow or working contract.

| Need | Canonical owner |
|---|---|
| Repository voice | [`voice.md`](voice.md) |
| Shared completion baseline | [`definition-of-done.md`](definition-of-done.md) |
| Architecture decision placement and criteria | [`architecture/CONTEXT.md`](architecture/CONTEXT.md) |
| Stage-scoped engineering references | [`engineering/CONTEXT.md`](engineering/CONTEXT.md) |
| Repository safeguards | [`engineering/safeguards.md`](engineering/safeguards.md) |
| Testing method | [`engineering/testing-rules.md`](engineering/testing-rules.md) |
| Local browser-test provenance | [`engineering/local-browser-test-environment.md`](engineering/local-browser-test-environment.md) |
| GitHub delivery rules | [`engineering/github-delivery-rules.md`](engineering/github-delivery-rules.md) |
| Multi-PR delivery rules | [`engineering/multi-pr-delivery.md`](engineering/multi-pr-delivery.md) |
| Optional Python defaults | [`engineering/python-tooling.md`](engineering/python-tooling.md) |
| Engineering principles | [`principles/engineering-principles.md`](principles/engineering-principles.md) |
| Earned product principles | [`principles/product-principles.md`](principles/product-principles.md) |
| UI/UX principles | [`principles/ux-principles.md`](principles/ux-principles.md) |
| UI/UX review rubric | [`ux/ui-ux-rules.md`](ux/ui-ux-rules.md) |
| Approved external reusable inputs | [`reusable-assets.md`](reusable-assets.md) |
| ICM structural methodology | [`methodology/interpretable-context-methodology.md`](methodology/interpretable-context-methodology.md) |

Templates live separately in [`../_templates/`](../_templates/). A workflow
contract names the exact template and shared references it needs.

## Human check

Confirm that a new cross-Project rule has one narrow owner, is supported by
accepted evidence, and is routed only to work that needs it.

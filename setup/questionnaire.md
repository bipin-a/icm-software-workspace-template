---
type: factory-setup
status: incomplete
---

# Factory setup questionnaire

Answer the required decisions one at a time, then batch the accepted answers into their canonical files. This file tracks setup status and ownership; it does not retain a duplicate answer set.

## Required before the first Project

1. **Identity and outcome:** Who is the workspace for, who owns material decisions, and what must be true for a workflow run to count as finished?
2. **Repository voice:** Accept the starter `_shared/voice.md`, revise it, or replace it with evidence such as representative good and bad examples.
3. **Non-negotiable constraints:** Which security, privacy, compliance, product, format, or workflow rules apply across every Project?
4. **Human proof and release path:** What does the human check before merge and production, which local and non-production environments are used, and when must work iterate before release?
5. **Reusable inputs:** Which templates, data sources, prior artifacts, environments, or external references may Projects reuse? Record ownership, access limits, and freshness expectations.
6. **Git and GitHub delivery:** Record the repository URL and visibility, protected branches, pull-request rule, eligible approval rule, merge method, branch naming, commit naming, and production-release owner.

## Canonical output map

| Decision | Canonical owner |
|---|---|
| Repository identity and routing | `../README.md`, `../AGENTS.md`, and `../CONTEXT.md` |
| Finished workflow run and human ownership | `../_shared/definition-of-done.md` |
| Repository communication | `../_shared/voice.md` |
| Cross-Project constraints | The narrowest applicable file under `../_shared/` |
| Proof environments and iteration | `../_shared/engineering/testing-rules.md` plus Project Technical Specifications |
| GitHub and release policy | `../_shared/engineering/github-delivery-rules.md` |
| Reusable inputs | `../_shared/reusable-assets.md` |

## Earned later rather than invented during setup

- Product principles enter `_shared/principles/product-principles.md` through an accepted cross-Project lesson.
- Executable test commands and required CI check names wait for a Technical Specification, working test configuration, and CI evidence.
- Technology, hosting, data, interfaces, and product-facing brand belong to the applicable Project specifications.
- Architecture decisions require an approved specification, spike evidence when needed, and an ADR only when the decision earns one.

## Completion

Set frontmatter `status` to `complete` only after the human approves the consolidated files and any live repository settings have been verified. Once complete, future agents read the canonical outputs and do not repeat this questionnaire unless the factory itself is intentionally reconfigured.

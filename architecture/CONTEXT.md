---
type: cross-project-architecture-router
status: active
---

# Cross-Project architecture investigations

One job: hold working architecture evidence only when several Projects share a
material uncertainty and no Project is its natural evidence owner.

## Route

- Prefer `projects/<project-slug>/investigations/` when one Project owns the
  question.
- Otherwise copy
  [`../_templates/architecture-investigation.md`](../_templates/architecture-investigation.md)
  to `investigations/<investigation-slug>.md`.
- Store an accepted cross-Project ADR under the
  [shared architecture library](../_shared/architecture/CONTEXT.md) only when
  the durable rationale affects several Projects and earns a separate record.

An investigation is an optional artifact, not another Project or permanent
workflow stage. It frames one decision, gathers only discriminating evidence,
records limitations, and routes each affected Project to its next
unresolved decision.

Findings remain evidence. Project brief and its linked decisions own Project
intent; an earned ADR owns durable rationale. Link those owners instead of
copying findings or changing implementation here.

Do not place Project-specific specifications, product delivery, live hold
status, or implementation in this folder. Promote the work to a Project when it
develops an independent product outcome, priority, acceptance contract, or
release.

## Human check

Apply the [shared investigation limit](../_shared/engineering/decision-work.md#investigation-limit).
Reuse existing authority for the question and scope. Resolve material choices
before dependent work; routine inspection requires no separate artifact or approval.

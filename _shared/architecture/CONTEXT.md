---
type: shared-architecture-library
status: active
---

# Shared architecture decisions

One job: route material architecture decisions to the correct durable owner.
The decision criteria and placement rules live in
[`decision-rules.md`](decision-rules.md).

Project-local decisions stay with the owning Project. Accepted decisions that
affect several Projects live under `_shared/architecture/decisions/` once one is
earned. Use [`../../_templates/adr.md`](../../_templates/adr.md) for either
scope; do not mechanically backfill historical decisions.

## Human check

Confirm the decision scope, affected Projects, decision owners, canonical
source updates, consequences, and supersession conditions before accepting an
ADR.

---
name: to-tickets
description: Turn an accepted brief or plan into dependency-linked vertical slices and an integration delivery structure when multi-PR coordination is warranted.
---

Read [AGENTS.md](../../../AGENTS.md) and the accepted chat/PR plan or selected
living Project brief. Use [Design](../../../workflows/02_design/CONTEXT.md)
for unresolved delivery choices and [Build](../../../workflows/03_build/CONTEXT.md)
for an agreed plan. Follow [multi-PR delivery](../../../_shared/engineering/multi-pr-delivery.md).

Use one PR unless independent proof, dependencies, or release risk justify
several. For each slice, identify the observable outcome, canonical owners,
discriminating proof, priority, blockers, merge conditions, and release gates.
Keep acceptance in its existing owner instead of copying a new specification.

Prepare the dependency order, integration shape, synchronization points, and
human checkpoints before creating live GitHub objects. Reuse existing authority;
resolve material scope choices first. Publish only within authorized scope.
Link the resulting issues and PRs from the brief. GitHub owns changing delivery
state; generated views are projections, not additional owners.

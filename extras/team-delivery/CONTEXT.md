---
type: team-kit-router
status: active
---

# Team delivery kit

One job: add the rules and tools a team needs to coordinate several PRs, run
a full candidate gate, and publish delivery views. A solo repository does not
need them.

| File | Adds |
|---|---|
| [`rules.md`](rules.md) | Extra Rules rows for each stage and the direct profile |
| [`multi-pr-delivery.md`](multi-pr-delivery.md) | Choosing, coordinating, and finishing work split across several PRs |
| [`delivery-views.md`](delivery-views.md) | Generated delivery status views from GitHub metadata |
| [`proof-tooling.md`](proof-tooling.md) | The exact-candidate gate and changed-file checks |
| `tools/` | The gate, its receipt verifier, delivery views, and changed-file selection |

The team size also keeps the `05_assess-readiness` and `06_release` stages and
the `to-tickets` skill. Setup with `--size solo` removes this folder and those
parts; see [`setup/CONTEXT.md`](../../setup/CONTEXT.md).

## Human check

Keep the kit only when the repository actually coordinates several PRs, runs a
full integration gate, or deploys through the release stage.

---
type: workflow-router
---

# 06_release — route one environment action

One job: route one release action for one environment and the exact candidate
accepted by Assess Readiness. This parent does not plan, deploy, verify, or
approve promotion.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Live working input: accepted candidate identity, current environment,
  completed release evidence, and latest human release decision
- Working: approved Delivery Assessment `Human decision`
- Working: approved Technical Specification `Environments and test data` and
  `Release, rollback, and monitoring`
- Capability routing: `../CONTEXT.md`

Do not load specifications, deployment credentials, implementation code,
release logs, engineering references, another stage, or prior Project runs
while routing.

## Routes

1. Verify the accepted candidate, current environment, and existing evidence.
   Stop if the environment is not named by the approved Technical
   Specification.
2. Without a reviewed no-write plan, enter
   [`01_plan-environment/`](01_plan-environment/CONTEXT.md).
3. With explicit authorization for that unchanged plan, enter
   [`02_deploy-environment/`](02_deploy-environment/CONTEXT.md).
4. After an attempted deployment, enter
   [`03_verify-environment/`](03_verify-environment/CONTEXT.md) in a fresh
   context for each required deployed criterion or risk proof.
5. With every required environment proof terminal, enter
   [`04_decide-environment/`](04_decide-environment/CONTEXT.md).
6. A source, target, or plan change invalidates authorization and returns to
   planning. A rejected or failed action follows the recorded earlier-stage,
   retry, rollback, or containment route.

---
type: workflow-router
---

# 06_release — select one environment action

One job: select the next authorized release action for an exact candidate and
environment.

## Inputs

- The candidate and readiness decision, requested environment, and accepted
  release obligations in chat/PR or the selected brief.
- Existing plan, authorization, deployment identity, and verification links.

Do not load credentials, implementation code, raw deployment logs, or another
environment's material while routing. The selected substep loads its needed
provider procedure and evidence.

## Routes

1. If deployment is outside the requested outcome, finish through
   [Assess Readiness](../05_assess-readiness/CONTEXT.md).
2. Without a concrete applicable plan, use
   [Plan the environment](01_plan-environment/CONTEXT.md). The
   [Release rules](references/release-rules.md) own provider configuration,
   target selection, and authority requirements.
3. With authority for the unchanged plan, use
   [Deploy the environment](02_deploy-environment/CONTEXT.md).
4. After an attempted deployment, use
   [Verify the environment](03_verify-environment/CONTEXT.md). Preserve partial
   state and follow only authorized recovery.
5. With the required evidence available, use
   [Decide the environment](04_decide-environment/CONTEXT.md).
6. A material change to source, target, or writes returns to planning and the
   applicable authority decision. An earlier environment's success does not
   authorize production.

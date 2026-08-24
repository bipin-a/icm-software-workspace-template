# Readiness rules

Use this table for findings:

| Finding | Evidence status | Contract relationship | Impact | Disposition | Why |
|---|---|---|---|---|---|
|  | confirmed, invalid, or uncertain | violates, outside, ambiguous, conforms, or accepted constraint | blocker, material, or opportunity | fix, change spec, reassess, accept risk, roadmap, defer, dismiss, or release |  |

## Safeguards

- Do not edit a specification merely to make it match built code.
- A product change requires rationale and human approval.
- A specification change invalidates dependent delivery assessment, build, validation, and readiness conclusions. Rebuild and revalidate the exact new candidate.
- Accepted risk records the consequence, affected users, mitigation, recovery path, approver, and revisit trigger.
- Deferred code needs an explicit disposition: keep on a draft branch, revert, disable through an approved design, or close.
- Uncertain evidence normally returns to Validate. High implementation uncertainty may return to Assess Delivery or Spec & Design.

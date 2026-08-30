---
type: workflow-step
context:
  capabilities: [exact-candidate-integration-gate]
  profile:
    path: _shared/engineering/profiles/validate-readiness.md
    heading: 04_validate-gate
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/delivery-assessment.md
      headings: [Final proof and release shape, Human decision]
  tools:
    - path: tools/icm/candidate-gate.mjs
      access: execute-only
---

# 03_verify-candidate-gate — run the full gate once

One job: run the configured complete integration gate once for the exact
unchanged candidate after focused review and criterion proof. This step does
not repair the candidate, repeat focused proof, or decide readiness.

## Inputs

- Repository inputs, selected headings, and profile are declared by `context`
  above.
- Live working input: exact candidate base and head, terminal review and
  criterion evidence, material finding dispositions, and existing gate state
  for this candidate.

Do not load full specifications, implementation code, complete diffs, unrelated
tests, another stage's references, or the engineering library.

## Process

1. Pin the exact candidate and verify every admitted focused evidence item
   applies to it.
2. Confirm baseline review and every required criterion result are terminal.
   Stop and route an undisposed material finding to Assess Readiness; do not run
   the expensive gate on a candidate already known to require correction.
3. Run the repository-configured full integration gate once from its required
   clean, isolated candidate context. Do not bypass its wrapper, reconstruct its
   internal phases, or substitute a different candidate.
4. Record exact candidate, command or configured procedure, environment and
   dependency identity relevant to reproducibility, terminal phases, duration,
   failures, and skipped phases on the canonical delivery surface. Keep any
   machine-local receipt outside versioned Project artifacts and link durable
   evidence instead.
5. Treat a failed phase as terminal evidence and a candidate finding. Do not fix
   it in this step. A changed candidate invalidates the result and returns to
   Build assembly.

## Outputs

- Exact-candidate terminal gate evidence and any machine-local receipt
- Stable evidence link for validation completion and finding disposition

## Human check

Confirm the exact candidate, gate, terminal phases, failures, omissions, and
evidence owner. A green gate does not approve readiness, merge, or release.

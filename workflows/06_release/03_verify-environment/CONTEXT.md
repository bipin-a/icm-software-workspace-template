---
type: workflow-step
context:
  parameters: [environment, criteria]
  profile:
    path: _shared/engineering/profiles/release-learn.md
    heading: 06_release-verify
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Canonical artifacts, GitHub delivery and release evidence]
    - path: projects/<project-slug>/specs/technical-spec.md
      headings:
        - Release, rollback, and monitoring
        - Risks and open questions
      tables:
        - heading: Environments and test data
          match: prefix
          values: ["{environment}"]
        - heading: Testing and acceptance proof
          match: contains
          values: ["{criteria}"]
  references:
    - path: workflows/06_release/references/release-rules.md
      headings: [Verify and decide]
---

# 03_verify-environment — prove one deployed obligation

One job: obtain terminal evidence for one accepted criterion or material risk
on one deployed environment and exact source. Another fresh context proves the
next obligation. This step does not repair, roll back, or approve promotion.

## Inputs

- Repository inputs, selected headings and rows, profile, and reference are
  declared by `context` above.
- Live working input: exact deployment attempt, deployed source and target
  identities, completed or partial writes, environment and data identity, and
  existing monitoring evidence.
- Capability routing: `../../CONTEXT.md`.

Do not load unrelated specification sections, raw credentials, implementation
code outside the proof seam, another environment, another stage's references,
or the engineering library.

## Process

1. Pin the selected obligation, deployed source, environment, target, data and
   reset method, required proof, migration state, and important production
   differences.
2. Run the configured routing or reachability check when required, then the
   selected Project-specific deployed proof.
3. Record exact commands or procedures, results, environment and data identity,
   what is and is not proved, failures, skipped proof, monitoring state, and
   rollback constraints.
4. Stop with terminal evidence. Do not infer contract success from reachability
   when acceptance requires behavior, persistence, migration, authentication,
   isolation, media, or another product consequence.

## Outputs

- Terminal evidence for one obligation, exact source, and environment
- Stable proof, failure, monitoring, and rollback links

## Human check

Confirm the obligation, source, target, evidence, failures, skipped proof,
monitoring, and rollback state before another obligation or release decision.

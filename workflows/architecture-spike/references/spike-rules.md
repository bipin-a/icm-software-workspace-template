# Architecture spike rules

A spike answers a narrow question whose evidence is needed before one or more Projects can proceed. It does not own product intent or ship user value.

Use a spike when uncertainty concerns a hard-to-change data model, source of truth, ownership boundary, interface, migration, foundational third party, or other cross-cutting architecture choice.

Promote the work to a Project when it develops its own product outcome, specification, independent priority, or release. A useful test is: if the sponsoring Project were cancelled, would this work still need to be built and released?

## Environment and test-data routing

- When the required data strategy is understood, implementing Project-specific fixtures, generators, seeds, or staging data is a delivery slice of the Project that needs the evidence.
- Use a spike only when an unresolved, consequential choice is blocking work, such as generated versus anonymized data, privacy-preserving relationship fidelity, schema-drift handling, or ownership of a shared dataset system.
- A reusable test-data platform becomes its own Project only when it has independent value, acceptance criteria, priority, release, and ongoing ownership.
- The spike produces discriminating evidence and a decision. The parent or independent Project owns the durable implementation.

## Impact and holds

- Name one parent Project and keep evidence under that Project when possible. If no Project is the natural evidence custodian, name sponsor Projects and use `architecture/spikes/<spike-slug>/`.
- Declare affected Projects and boundaries in the brief; do not discover them silently after work resumes.
- Pause only workstreams whose assumptions may be invalidated.
- A global hold requires a shared contract, data model, source of truth, security boundary, or foundational dependency with broad impact.
- The spike does not implement changes in affected Projects. Their own workflows own implementation.

## Evidence and ownership

- Spike code and experiments are disposable unless later specified and rebuilt through Build.
- Findings are evidence, not current architecture.
- Place the accepted decision and rationale according to [`decision-rules.md`](../../../_shared/architecture/decision-rules.md).
- Affected Projects link to the shared ADR and update their own Technical Specifications; do not copy findings.
- After a specification changes, rerun Assess Delivery and rebuild and revalidate any invalidated candidate.

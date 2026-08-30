# Architecture decision rules

The Technical Specification owns the current architecture for one Project. An
ADR records why a material, durable architecture decision was accepted; it does
not become a second specification.

## When an ADR is earned

Create an ADR when a decision does one or more of the following:

- changes several workstreams or Projects;
- establishes a hard-to-change data, ownership, persistence, or interface boundary;
- introduces meaningful third-party dependence;
- has credible competing alternatives with different consequences;
- changes security, migration, deployment, recovery, or operational
  assumptions.

Do not create an ADR for routine implementation, a reversible local choice, a
research finding with no accepted decision, or a preference already owned by an
approved specification or shared principle.

## Placement

Store a Project-local ADR at
`projects/<project-slug>/decisions/ADR-NNN-<slug>.md`. Store an accepted
cross-Project ADR at
`_shared/architecture/decisions/ADR-NNN-<slug>.md` and link each affected
Project specification to it.

## Evidence and canonical ownership

Investigation and prototype findings remain evidence. Link them from the ADR;
do not copy their full contents into the decision or affected Projects. Record
the decision, rationale, alternatives, consequences, and revisit conditions
once. Describe each Project's application in its Technical Specification.

An accepted ADR names every canonical source that must change. If the decision
is later replaced, preserve the old record, link its successor, and update the
sources that apply the current decision.

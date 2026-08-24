# Architecture decision rules

The Technical Specification owns the current architecture for one Project. An ADR records why a consequential decision was accepted.

Create an ADR when a decision does one or more of the following:

- changes several workstreams or Projects;
- establishes a hard-to-change data, ownership, persistence, or interface boundary;
- introduces meaningful third-party dependence;
- has credible competing alternatives with different consequences;
- changes security, migration, deployment, or recovery assumptions.

Store a Project-local ADR at `projects/<project-slug>/decisions/ADR-NNN-<slug>.md`. Store an accepted cross-Project ADR at `_shared/architecture/decisions/ADR-NNN-<slug>.md` and link affected Project specifications to it.

Spike findings remain evidence. Do not copy them into an ADR or affected Projects. Link to them, record the decision and rationale once, and describe each Project's application in its Technical Specification.

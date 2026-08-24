# Engineering principles

Cross-Project rules for architecture, implementation, security, and maintainability.

## Principles

- Let product concepts and invariants shape the domain model; do not let framework convenience define the domain.
- Validate untrusted data at explicit system boundaries.
- Make expensive-to-reverse, cross-cutting architecture choices visible and human-approved.
- Prefer the simplest reversible design. Add extension seams only for credible pressure on hard-to-change boundaries.

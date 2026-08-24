# Validation review rules

## Mandatory baseline

- Check each acceptance criterion and its observable consequence.
- Read the focused diff against the exact candidate identifier.
- Look for contradictions between the Project intention, specifications, implementation, and evidence.

## Evidence context

- Record whether evidence came from local, CI, dev, staging, or production.
- Record whether data was synthetic, fixture, mock, anonymized, or production, including a dataset identifier or version when available.
- State what the evidence establishes and what remains unproven because of the environment, dataset, actors, or test method.
- Local and staging evidence can prove represented behaviour and support human usability judgment. It does not by itself prove real-world adoption or outcomes.
- Confirm that test data covers the lifecycle states, relationships, and boundary conditions required by the specifications.

## Conditional angles

Use an angle only when the changed surface or risk earns it:

- Removed-behaviour audit
- Cross-file trace
- Language-specific pitfalls
- Facade or adapter correctness
- Reuse and duplication
- Simplification
- Efficiency
- Altitude check against the specification and Project goal

## Finding format

For each material finding record:

- Observation
- Evidence
- Specification relationship: `conforms`, `accepted constraint`, `ambiguous/spec gap`, `contract deviation`, or `not covered`
- Why it may matter
- Concrete example
- Possible responses and their costs
- Decision owner

Validation reports; it does not repair or dispose of a finding. A finding may reveal purposeful scope, an accepted constraint, or a flaw in the specification. Assess Readiness owns that distinction.

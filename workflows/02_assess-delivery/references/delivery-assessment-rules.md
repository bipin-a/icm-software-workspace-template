# Delivery assessment rules

Use implementation estimates to support a product decision, not to make one automatically.

## Preserve the intention

- Restate the outcome the Project is trying to create before assessing its proposed implementation.
- Prefer the simplest option that preserves the accepted intention and its essential constraints.
- Prefer the smallest coherent slice that produces a useful outcome or decision-changing evidence.
- Show what each simpler option removes, delays, or leaves unproven.
- Do not reduce user trust, accessibility, data integrity, security, or recovery merely to reduce scope.

## Make the investment decision after specification

- Spec & Design makes the idea concrete enough for delivery cost and uncertainty to become visible. Assessment then decides whether the expected value justifies that cost.
- Record the evidence for the expected value, the assumptions it depends on, why the work matters now, the accepted appetite, the consequence of delay, and the next-best use of the effort.
- Do not turn these considerations into a composite score. The human decides whether the trade-off is worthwhile.
- If expected value depends on a material untested assumption, prefer the cheapest discriminating prototype or proof before committing to the complete implementation.

## Assess each proposed slice

Use separate measures rather than one false-precision complexity score:

- **Size** — `S`, `M`, or `L`: the amount of implementation and review work.
- **Risk** — `Low`, `Medium`, or `High`: the impact and recovery cost if the change is wrong.
- **Uncertainty** — `Low`, `Medium`, or `High`: how much important behaviour or feasibility remains unknown.

Give a short reason for every rating.

- An `L` slice should normally be divided unless it is a broad mechanical change that cannot be split safely.
- High risk requires stronger proof, explicit human gates, and a credible rollback or recovery path.
- High uncertainty should usually trigger a product prototype or architecture spike before implementation, not a larger estimate.

## Compare options

Always consider:

1. the complete proposed implementation;
2. a simpler implementation that preserves the intention;
3. phased or POC delivery;
4. a prototype or architecture spike that resolves a material unknown; and
5. deferring or rejecting the Project.

## Future readiness

A future direction may justify current flexibility only when:

1. it is plausible and recorded in the roadmap;
2. it pressures a boundary that will be expensive to change, such as persisted data, a public interface, identity, or canonical ownership;
3. a small seam now avoids disproportionate migration later;
4. the seam does not create a parallel model, fallback, or speculative framework; and
5. the human accepts its current complexity cost.

Prefer a documented migration path or prototype when the future need is uncertain. Ordinary classes and internal functions can usually be refactored later; do not generalize them merely because a future feature is imaginable.

## Diagram rules

- The slice table is the canonical proposed plan.
- Generate the Mermaid diagram from that table.
- Use the diagram to show dependencies and possible parallel work, not as the complexity measure itself.
- Once approved delivery objects are published, GitHub owns live delivery status.

## Decision rule

The human first decides whether the Project remains worth doing at the assessed cost, then chooses the delivery shape. Record the choice, reasoning, accepted omissions, and any specification changes. Do not begin Build while the decision, delivery profile, or an applicable architecture hold is unresolved.

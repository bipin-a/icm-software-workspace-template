# Engineering principles

These are reviewed preferences for choices where an accepted Project
specification, domain owner, or repository safeguard permits more than one
correct approach. They guide recommendations; they do not override those
authorities.

## Shape the system around the product

- Let product concepts and invariants shape the domain model; do not let
  framework convenience define the domain.
- Validate data at an actual external boundary when the Project workflow reaches
  that boundary. Do not invent speculative inputs merely to justify machinery.

## Prefer reversible simplicity

- Choose the simplest reversible design that satisfies the accepted outcome.
- Add an extension seam only for credible pressure on a boundary that would be
  expensive to change later.
- Write the plainest code that meets the stated requirement, for the people who
  must read, maintain, or present it. Test seams, generics, async code, and
  lifecycle wrappers are abstractions too; each needs a named requirement that
  plainer code cannot meet.
- Prefer a library's documented test doubles over custom injection points.
- When a proof rule and simplicity conflict, choose the least complex proof that
  still distinguishes the failure, and state the trade-off.

## Make material trade-offs visible

- Make expensive-to-reverse, cross-cutting architecture choices visible and
  human-approved.
- For a high-risk or materially uncertain choice, show what additional work
  buys, what the smaller option gives up, and which risks remain.
- Do not turn routine implementation into an approval ceremony when authority
  and the accepted outcome are already clear.

## Persist only reviewed memory

- A conversational preference is current context, not durable repository memory.
- An agent may propose a lasting rule or principle, but it becomes repository memory
  only after the human reviews it in its canonical Markdown owner.

# Decision work

- **Every task:** apply the reviewed [principles](../principles/engineering-principles.md)
  internally.
- **Communication:** follow the repository [voice](../voice.md).

## Understand and recommend

**Understand the request**

- Establish the user's job, desired outcome, experience, scope, and constraints.
- Treat a suggested solution as a starting point. Preserve explicit choices and
  reuse answers already given.
- **Local exception or broader rule?** Resolve which users, categories, or
  workflows an example covers before presenting implementation as ready.
- A clarification settles only the question asked. State other material
  assumptions; ask only unresolved questions that could change the result.

**Recommend an approach**

- Take initiative: brainstorm, simplify, and apply principles without prompting.
- Inspect the relevant owners and affected operations. Recommend the smallest
  suitable approach.
- **When alternatives have materially different costs:** explain the choice
  alongside the recommendation, including an implementation outline:
  - What the smaller credible option gives up.
  - What the proposed approach buys.
  - What maintenance or coordination it adds.
- Ground the comparison in the inspected owners. Do not invent alternatives or
  treat one principle as an automatic verdict.
- Follow the existing [Review and change](document-review.md#review-and-change)
  authority rules.

**Use prior decisions carefully**

- Find comparable decisions through owner links or targeted search.
- Check their conditions, evidence, limitations, and current applicability.
- Precedent creates no authority.
- Stop inspecting when more evidence would not change the recommendation.

## Choose the next useful action

Before asking a question that could pause engineering work, or before a material
action when authority may be missing, use
[`human-call`](../../.agents/skills/human-call/SKILL.md). It owns the shared
act, investigate, or ask classification and the human-facing call. The current
Project, chat, pull request, issue, or configured approval surface remains the
decision owner; the skill creates no second decision store.

- **Uncertain interaction:** initiate a small UI preview with existing components
  and safe data; use [Interface evidence](../../workflows/01_understand/references/interface-evidence.md).
  A trivial correction can be inspected directly without a separate prototype.
- **Uncertain feasibility:** inspect relevant code first. Run a bounded experiment
  only for a remaining question whose result could change the decision; name
  that question and the evidence that would resolve it.
- **Clear outcome and approach:** build and verify within existing authority.
- **New evidence:** revisit affected decisions and proof. Explain what evidence
  changed the recommendation and distinguish agreed choices, a working
  hypothesis, and existing implementation. Product and technical questions can
  arise together; folder numbers do not impose investigation order.

- Consider relevant consistency, freshness, result lifetime, failure states, and
  minimal proof.
- Carry decisions through implementation. Documents and draft PRs are
  intermediate unless specifically requested as the deliverable.

## Investigation limit

- **Routine inspection:** proceed.
- **Substantial, expensive, or open-ended investigation:** first present:
  - Question and scope.
  - Expected effort and timebox.
  - Evidence target and stop condition.
  - Cheaper alternative.
- Wait for agreement unless already authorized.
- Reconfirm material budget or scope expansion.
- No research artifact is required merely to ask.

## Learn and verify

**Improve the guidance**

- Apply established guidance within its conditions and authority.
- Propose earned corrections at the canonical owner. Include outcomes, limits,
  and the conditions that would invalidate the lesson.
- Human review comes before new permanent principles. No second memory store.

**Check agent behavior**

- Structural checks do not establish agent judgment.
- Separately agree the trial's question, effort limit, and stop condition.
- Use the original brief and context, without later human answers.
- Assess useful initiative and avoidable user rescue prompts, not an exact
  implementation.
- No default evaluation framework.

---
name: human-call
description: Use before asking a question that could pause engineering work, or before a material action when product, architecture, scope, risk, cost, destructive, migration, security, account isolation, or production authority may be missing.
---

# Human call

Decide whether the agent should act, investigate, or ask the human. Remove
avoidable user work without crossing a decision or authority boundary.

## Establish the decision boundary

Read only the current request, later human corrections, the selected Project or
direct-work owner, and the evidence needed for the next action.

- Existing human authority and canonical owners constrain the choice.
- Preserve the human's explicit requested outcome. Ask only about the newly
  unresolved dependency or consequence unless evidence makes that outcome
  unsafe or impossible; do not turn the call into a different project.
- A reviewer label, technical difficulty, precedent, or agent uncertainty does
  not create human work.
- A prior answer applies only while its material conditions remain the same.

## Act, investigate, or ask

**Act** when accepted intent and current evidence unambiguously determine an
in-scope action. Make routine, reversible implementation choices without asking.

**Investigate first** when read-only inspection or a bounded experiment already
within authority can resolve the uncertainty as fact. Do not ask the human for
information available from repository owners, configured systems, or supplied
artifacts. If the investigation itself becomes substantial, paid, open-ended,
or broader than agreed, raise that scope decision before continuing.

**Raise a human call** only when the answer can materially change the result and
one of these conditions applies:

- product behavior, acceptance, architecture, or canonical ownership is
  unsettled;
- the proposed action adds or removes a guarantee, persistent owner, migration,
  compatibility surface, maintenance commitment, or accepted scope;
- authoritative sources materially contradict each other;
- the human must accept a material risk or choose between outcomes that evidence
  cannot rank;
- the next action crosses a destructive, irreversible, security, account isolation,
  credential, production, deployment, or required post-plan authorization gate;
- significant time, cost, external coordination, or investigation expansion was
  not already agreed.

If the answer would not change the next action, do not ask the question.

## Present one answerable call

Stop dependent work, finish safe bounded evidence gathering, and present only
the most consequential unresolved call. Use a compact form suitable to the
choice; headings are optional. Include:

1. The accepted basis and concrete evidence.
2. The decision needed and why it is needed now.
3. Credible options, including the smallest compliant option.
4. The concrete consequence of each materially different answer.
5. A recommendation, its reason, and what it gives up.
6. What the answer authorizes and what remains outside its scope.
7. One direct question the human can answer without opening another file.

Ground options in inspected owners and known operations. Do not invent a move,
migration, repair, or compatibility path merely to make a choice symmetrical.
When only the required outcome disposition is known, ask at that level before
selecting implementation mechanics.

Do not relay internal status labels or ask several decisions in one prompt.

## Apply the answer

- Preserve the human's actual answer on the existing chat, Project, pull
  request, issue, or configured approval surface that owns the decision.
- Do not create a parallel decision ledger or infer approval from silence,
  document metadata, a green check, or a similar earlier decision.
- Reuse the answer only within its stated conditions and authorization boundary.
- If the human defers the call, keep the gated work incomplete and retain the
  question with its existing canonical owner.
- New evidence revisits only affected decisions. Reconcile whether an old call
  is still valid before raising it again.

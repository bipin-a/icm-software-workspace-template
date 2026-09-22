# Firstmate decision escalation — 2026-09-14

This is optional, dated background research for maintainers evaluating the
[`human-call` skill](../../../.agents/skills/human-call/SKILL.md). It is not an
execution rule, a dependency, or authorization for further implementation.
Normal engineering work does not need to load this assessment.

The assessment is adapted from research recorded on 2026-09-14 against
[Firstmate commit b182d0f](https://github.com/kunchenguid/firstmate/tree/b182d0f908b78d08c7ccb8dce3775bdca8c5d657).
It describes that revision, not Firstmate's current behavior. The findings came
from source and documentation inspection, not an installation, runtime trial,
or comparative evaluation of agent judgment.

## Ideas adopted in this template

Firstmate's
[ask-user-authority procedure](https://github.com/kunchenguid/firstmate/blob/b182d0f908b78d08c7ccb8dce3775bdca8c5d657/.agents/skills/ask-user-authority/SKILL.md)
distinguishes corrections required by accepted intent from unsettled decisions,
contract expansion, and destructive or security-sensitive choices. Technical
difficulty and reviewer labels alone do not create human work.

Its escalation packet identifies the accepted requirement, proposed expansion,
smallest conforming alternative, consequences, and recommendation. This informed
the template's human-call presentation. The local skill also explicitly
separates factual uncertainty that inspection can resolve from choices that
need human authority.

The canonical skill owns the act, investigate, or ask procedure. Shared rules
route to it, and the Claude adapter points to the same owner. Human answers
remain on their existing chat, Project, pull request, issue, or approval
surface. Structural checks verify those routes; they do not prove judgment.

## Ideas assessed but not implemented

Firstmate's
[captain-hold lifecycle](https://github.com/kunchenguid/firstmate/blob/b182d0f908b78d08c7ccb8dce3775bdca8c5d657/.agents/skills/captain-hold-lifecycle/SKILL.md)
keeps unanswered calls with their owning work items. It checks open decisions
before completion, records actual answers, and distinguishes deferral from
completion. Its
[ahoy flow](https://github.com/kunchenguid/firstmate/blob/b182d0f908b78d08c7ccb8dce3775bdca8c5d657/.agents/skills/ahoy/SKILL.md)
brings unresolved decisions back to attention one at a time.

These mechanisms suggest possible remedies for decisions lost across sessions,
but the template does not implement a decision inventory, completion command,
held-task lifecycle, reminder system, or derived waiting-decisions view.
Copying this assessment activates none of them.

Such additions would need evidence of missed decisions, a separate scope
choice, and an existing canonical owner. A second decision ledger would add
reconciliation work and risk conflicting with the actual human answer.

## Why this is not a Firstmate integration

At the inspected revision, Firstmate described itself as an
[agent distribution](https://github.com/kunchenguid/firstmate/blob/b182d0f908b78d08c7ccb8dce3775bdca8c5d657/README.md)
with supervision, worker sessions, state, and delivery infrastructure. Importing
that architecture would be substantially broader than improving when and how
an agent asks a question. This template installs none of it.

The smaller choice is the standalone decision skill and its routing. It gives
agents an explicit decision procedure without another state system, but it
does not guarantee that unanswered calls resurface after context loss.

## Evidence still needed

Behavioral replay adaptation and agent trials are outside this port. A future
trial should use original inputs without later human answers and assess both
unnecessary questions and missed necessary calls. Agree its scope and stop
condition separately. Passing link and tooling checks cannot establish that
an agent applied the decision procedure correctly.

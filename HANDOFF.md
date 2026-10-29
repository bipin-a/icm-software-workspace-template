# Handoff: drift tracking and review follow-ups (2026-10-28)

Temporary file on branch `handoff/drift-tracking`. Delete it once the work
below is done or moved to its owners. Nothing here is an accepted rule.

## Where we are

- `main` is unchanged. This branch adds only this file and a parked research
  note: `_shared/engineering/evidence/workflow-attention-2026-10-14.md`.
- No rule files (`decision-work.md`, workflow stages) were changed. One edit
  to `decision-work.md` was tried and reverted (see below).
- Nothing is built yet. The next step is the `!drift` hook.

## How we got here

1. **"Phase attention" idea.** Proposal: decide which ICM stage deserves extra
   effort right now, and add a Focus/Action/Stop instruction to
   `decision-work.md`, plus a trial.
   **Rejected.** Most of it already exists in `decision-work.md` and the
   workflow router; no real case of misplaced effort was found; the cited
   papers support adaptive effort in general, not this instruction.
   The research is kept, parked, in the evidence note.
2. **Narrow edit tried, then reverted.** We widened one bullet in
   `decision-work.md` ("Uncertain feasibility" → "Unresolved decision: name the
   question and the evidence that would resolve it").
   **Reverted** because `.agents/skills/human-call/SKILL.md` already owns that
   (investigate facts first, ask the human for product/ownership choices).
   Repo rule: one owner per decision; link, don't copy.
3. **Redundancy question.** Agents follow only what is in context when they
   decide. Rule of thumb we settled on: write each rule once, point to it
   where it's needed, add a pointer only after you see a miss, never paste a
   second copy. Supporting research: ETH Zurich "Evaluating AGENTS.md"
   (redundant context files cost more, help little), IFScale (adherence drops
   as instruction count rises), Lost in the Middle.
4. **Drift is a real problem** (confirmed by the user). Observed symptoms:
   agent revives rejected decisions, breaks accepted constraints, repeats
   failed approaches, mixes tasks. Also: editing a rule file mid-thread leaves
   the old and new version both in context.
5. **A plan from another session** proposed an agent-kept mistake tally in
   chat, a human "Ready for final validation?" gate, and a Codex hook.
   **Narrowed** to: count drift with a hook the human triggers (accurate,
   survives compaction); hold the gate until a real early-validation case;
   keep tally and gate as separate decisions.
6. **Code review post.** Compared ICM with
   [Solving code review at Anthropic](https://claude.dev/blog/solving-code-review-at-anthropic/).
   ICM already matches on evidence over claims, no agent-as-human approval,
   per-commit approval, risk-triggered review angles, resolving every finding.
   Gaps: no risk-tier approval table, no review round cap, no "pre-existing"
   finding tag, no fresh-context reviewer, no revert-rate metric.

## Where we're going (in order)

### 1. Build the `!drift` hook (next)

Purpose: count drift per thread so you know when to hand off, and collect
evidence for any later rule change.

- One shared script: `tools/icm/drift-hook.mjs`.
  - Runs on `UserPromptSubmit` (exists in both Claude Code and Codex).
  - If the prompt starts with `!drift` (optional category word after it),
    add one to a per-session counter in `.icm/drift/<session_id>.json`
    (add `.icm/` to `.gitignore`).
  - Return a short line to context, e.g. `drift: 2 this session`.
  - Any other prompt passes through untouched.
- Two thin configs pointing at the script:
  - Claude Code: `.claude/settings.json` (`hooks.UserPromptSubmit`).
  - Codex: `.codex/hooks.json`.
- Verify before relying on it:
  - Input field names (session id, prompt) may differ between the tools; the
    script should accept both.
  - Codex hooks must be trusted before they run and may need a feature flag
    depending on version. Check https://developers.openai.com/codex/hooks
    against the installed Codex version.
- Test both tools with a real `!drift` prompt.
- Run as a trial for about two weeks. No rule-file changes during the trial.

How to use the count: 1 drift → correct once; the same drift again → hand off
to a fresh thread; drift that keeps returning in fresh threads → fix the
instructions, task, or tools instead.

### 2. Small review-rule additions (draft, needs approval)

In `workflows/04_validate/references/review-rules.md`:
- Cap review rounds at three; after that, reconsider the approach.
- Tag findings the change didn't introduce as pre-existing.

### 3. Parked until there is evidence

- **Validation gate** (agent asks "Ready for final validation?" and waits).
  Add only after a real case of validation starting too early. If drift
  tags show that pattern, that's the evidence.
- **Risk-tier approval table** (none / one / two humans by change type).
  Belongs in each instance's setup, not the template.
- **Revert rate as a guardrail metric**, alongside `!drift`.

## Handoff tips for the next session

- Read `AGENTS.md` first, then this file.
- Change rule files between sessions, not mid-thread; if you must, say
  explicitly that the new version replaces the old.

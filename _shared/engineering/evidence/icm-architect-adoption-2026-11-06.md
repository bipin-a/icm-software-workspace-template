# icm-architect assessment — 2026-11-06

This is optional, dated maintainer research. It records why the template
adopted some icm-architect ideas and not others. It is not an execution rule.
The [README](../../../README.md#maintain-this-template) and `workspace-check`
own the adopted behavior. Normal engineering work does not need to load this
note.

It compares this template with
[icm-architect at 8bc2f56](https://github.com/RinDig/icm-architect/tree/8bc2f5610d3843b3ffa31a142effe6b6337fef3c)
(`README.md`, `SKILL.md`, `references/`, `scripts/`). It is based on reading the
source and the Gemini CLI docs as of this date. Nothing was installed or run in
Gemini CLI. The template already credits icm-architect as an influence in
[`README.md`](../../../README.md).

## Outcome

| Idea | Outcome |
|---|---|
| `GEMINI.md` pointer to `AGENTS.md` | Adopted: root `GEMINI.md` plus a checker rule |
| Gemini loads `.agents/skills/` | No change needed; verify on first Gemini run |
| Walk test | Adopted, adapted, as a template-maintenance check in the README |
| `links.py` | Not adopted; its `@` import rule became the pointer check |
| `quotes.py`, `index.py` | Not adopted |
| `viz.py` graph | Parked |
| Restructure safeguards | Not adopted; noted below |

## Entry file and `GEMINI.md`

**Adopted:** a root `GEMINI.md` whose only content is `@./AGENTS.md`.

- Gemini CLI loads `GEMINI.md` by default and supports relative `@file`
  imports
  ([docs](https://geminicli.com/docs/cli/gemini-md/)). icm-architect uses the
  same pointer, and its `references/core.md` (Naming) says to use a one-line
  pointer, never a second copy.
- This matches the template's existing adapter pattern: `.claude/skills/*`
  point to the canonical `.agents/skills/*` and own no procedure.
- **Alternative considered:** set `context.fileName` to `AGENTS.md` in
  `.gemini/settings.json`. Not recommended:
  - The setting renames the context file everywhere Gemini looks, including the
    user's global `~/.gemini/` file, so a personal `GEMINI.md` would stop loading.
  - The docs' example list also includes `CONTEXT.md`. Gemini concatenates every
    matching file on the path and sends it with every prompt. Here that would
    load each route's `CONTEXT.md` automatically, which works against scoped,
    per-stage loading. Never add `CONTEXT.md` to that list.
- **Checker rule:** if `GEMINI.md` exists, it must hold only the `AGENTS.md`
  import, so it cannot become a second entry file. An instance that drops
  Gemini support may delete it.
- **Verify on first use:** `/memory show` in Gemini CLI lists the `AGENTS.md`
  text.
- **Out of scope:** the repository has no `CLAUDE.md`. Whether to add one is a
  separate decision.

## Skills in `.agents/skills/`

**Finding:** no change needed.

- Gemini CLI reads workspace skills from `.gemini/skills/` or its
  `.agents/skills/` alias. The alias wins within the same tier
  ([docs](https://geminicli.com/docs/cli/skills/)).
- The canonical `human-call`, `integration-review`, and `to-tickets` skills
  already live in `.agents/skills/`. Gemini should find them with no adapter.
- Gemini asks the user to confirm before it activates a skill. That is
  consistent with the template: a skill is a procedure, not authority.
- **Verify on first use:** `/skills list` shows the three skills.
- Do not add `.gemini/skills/` adapters. They would be a second copy that the
  alias makes unnecessary.

## Walk test

**Adopted:** an adapted walk test as a manual check after changes to routing,
entry, or stage files. It is not a workflow stage or a per-change gate.

icm-architect's test: an agent with no memory must orient, act, and report
status from the files alone. The parts that fit this template:

- From `AGENTS.md` plus at most two more reads, a cold agent names the route and
  canonical owner for a sample task.
- A chosen stage contract names its inputs, job, outputs, and human check.
- No routing file carries content. No decision has two homes.
- `npm --prefix tools/icm run context` keeps a selected packet within
  `icm.config.json` limits.

Why: `workspace-check` proves structure. It does not prove that a model with
no history picks the right route. Running the walk in Gemini CLI as well as
Claude and Codex is a cheap cross-tool check before the client spike.

**Adaptation needed:** icm-architect's walk also asks the agent to state status
from what is on disk (`check.md` verdicts). That conflicts with this template:
live delivery, approval, and check state are read from GitHub and check
providers, never copied into files. The adapted walk asks: *can the agent name
where live status is read from?*

## Scripts versus `tools/icm`

| icm-architect script | What `tools/icm` already does | Proposal |
|---|---|---|
| `links.py`: relative links, `@` import pointers, backticked Inputs paths, optional graph | `workspace-check` checks every local markdown link, blocks links that leave the repo (including through symlinks), checks stage reachability, contract markers, frontmatter `context.inputs` targets, and skill adapters | Not adopted. Its `@` import rule became the `GEMINI.md` pointer check |
| `quotes.py`: quotes match a raw transcript or page, keep-out phrases | Nothing equivalent. Evidence here cites pinned commits and links, and the paper notes are paraphrased | Do not adopt. It serves knowledge bundles built from transcripts, not this workspace |
| `index.py`: generated `_index.md` per folder | Routers (`CONTEXT.md`) are short and hand-owned | Do not adopt. No shelf here is large enough to need an index |
| `viz.py`: interactive graph of the link walk | Nothing equivalent | Park. Useful for a person reading a large instance, but it adds no check and the page loads libraries from a CDN |

Reasons not to copy the scripts in:

- **Language:** the template's tools use Node.js built-ins only, with no install
  step (`README.md`, Workspace tools). Adding Python 3 would add a second
  runtime for checks the Node checker already covers.
- **Inputs format:** `links.py` checks backticked paths under an Inputs heading.
  Stage inputs here are named brief headings in frontmatter, which
  `workspace-check` already checks. The two formats would disagree.

## Conflicts with current template decisions

None of these changed. They are listed so nobody adopts them by accident.

| icm-architect | This template |
|---|---|
| Each stage writes to its own `output/` folder; the next stage reads it | Stage outputs live in the owning chat, PR, or Project brief ([adaptation notes](../../methodology/interpretable-context-methodology.md#software-workspace-adaptation)) |
| Status lives on disk; a non-human check writes `check.md` with `pass` or `fail` | Live delivery, approval, and check state is read from its owner; a green check never implies approval (`AGENTS.md`) |
| Every step ends at a check by a person, a script, or a small model | Human authority comes from chat or the PR; it is never inferred from a model or script verdict |
| Scripts in `_tools/`, Python 3 | Scripts in `tools/icm/`, Node.js built-ins |
| Generated `_index.md` files | Hand-owned routers; no generated indexes |
| Step context under about 8,000 tokens | `icm.config.json`: 7,000-token packet plus 500 reserve. Compatible; no change |

## Smaller ideas worth noting

- **Restructure safeguards.** icm-architect's restructure mode says to find
  every referrer before moving a file, and to check for case-folded name
  collisions on macOS and Windows (renaming to `CONTEXT.md` can overwrite
  `context.md`). This could become one line in
  [`safeguards.md`](../safeguards.md) for repository adaptation. Low priority.
- **Breaking an invariant on purpose.** icm-architect asks for the reason in the
  nearest `CONTEXT.md` or `AGENTS.md`. The template's adaptation notes already
  do this.

## Verify on first Gemini run

On the spike VM, before relying on Gemini CLI:

1. `/memory show` lists the `AGENTS.md` text.
2. `/skills list` shows the canonical skills.
3. Run the walk test in Gemini CLI and record any mismatch here or on the PR.

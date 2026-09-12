# GitHub delivery rules

Git owns implementation history. GitHub owns live issues, PRs, reviews, settings,
and checks. Briefs own durable decisions and links. This source template makes
no claim about an instance's visibility, protected branches, or approval rules;
verify and record the applicable policy during setup.

## Delivery profiles

Use one Project branch and one PR by default. Create a separate worktree when
independent concurrent work or the full candidate gate needs it. Bounded work
needs no Project branch ceremony beyond the repository's normal Git policy.
Do not create artifact-only precursor PRs or extra issues for routine work.
Use [multi-PR delivery](multi-pr-delivery.md) when dependencies or risk require
several reviewed changes to converge before release.

## Repository hygiene and branches

- Inspect worktree, branch, staged changes, and the complete comparison diff.
- Preserve unrelated changes; never commit secrets or unapproved personal data.
- Use the instance's configured branch convention; this template imposes none.
- Derive the destination branch from the task and verified repository policy.
- Verify exact head and base before a push or PR mutation.
- Do not force-push, rewrite published shared history, or delete branches or
  worktrees without explicit authority.

## Commits

Keep commits focused, understandable, and reversible. Include relevant proof
with behavior changes; omit unrelated cleanup. Derive reports from Git evidence.
Use concise imperative subjects. Do not add an automation tool as co-author.

## Pull requests are human review surfaces

Use the [PR template](../../.github/pull_request_template.md): Problem, Change,
Validation, Risks / Follow-ups. State the concrete before/after result and any
material choice or sacrifice. Include comparison base, tested candidate,
commands, outcomes, and omissions. Link decision owners without copying them.
Add lifecycle, migration, environment, or integration detail only when relevant.
A scoped N/A replaces irrelevant proof. Do not infer merge authority from green CI.

## GitHub command adapter

Use an available repository-authorized connector or CLI. Inspect its supported
arguments; do not assume wrappers preserve raw CLI flags. Use structured text or
a real UTF-8 body file for multiline updates. Read the saved object back before
reporting success. Preserve human-authored text during partial/generated updates.

## Checks and delivery truth

Read required check names and current state from executable workflows and live
GitHub settings. Pending is incomplete. Report exact candidate, terminal results,
links, failures, skipped checks, and unavailable evidence. Recheck before merge;
read the deployment platform before release.

## Traceability and human gates

Link actual implementation, review source, exact reviewed revisions, and
applicable release evidence from the brief/PR. A green structural check is not
human approval. Required review and merge preconditions apply to the exact
candidate. Production needs explicit human authorization under the release
procedure even after merge or successful non-production proof.

## Merge methods preserve evidence and history

Choose from the repository's actual policy before merge. Squash is suitable for
one ordinary reviewable change. When acceptance or gate evidence needs the
validated head to remain reachable, use a method that preserves that identity.
For multi-PR delivery, define child-to-integration and integration-to-trunk
methods together. Do not silently change methods or rewrite reviewed identities.

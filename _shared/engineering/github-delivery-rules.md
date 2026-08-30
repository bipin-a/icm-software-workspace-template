# GitHub delivery rules

This file owns shared Git and GitHub delivery procedure. Project specifications
own intended behavior and acceptance. Git owns code history, GitHub owns live
issues, pull requests, settings, and checks, and the deployment platform owns
live release state. Re-check live state before relying on it.

## Repository configuration evidence

Repository URL, visibility, default and protected branches, pull-request rule,
eligible approval rule, enabled and selected merge methods, branch convention,
commit convention, required checks, and production-release owner are setup
decisions. Record accepted policy through
[`../../setup/questionnaire.md`](../../setup/questionnaire.md) and verify live
GitHub settings before the first applicable delivery action.

GitHub remains canonical for current settings. A dated verification record is
evidence, not a competing configuration owner. Do not copy settings from the
template description into an instantiated repository.

## Delivery profiles

Every Project selects one profile through its approved Delivery Assessment
before Build:

- `single-pr` — one pull request can be reviewed, validated, and released
  safely; target the configured trunk branch directly.
- `multi-pr` — several independently reviewed pull requests must be assembled
  before the Project has value; follow
  [`multi-pr-delivery.md`](multi-pr-delivery.md).
- `undecided` — allowed during specification and delivery assessment, but not
  when Build begins.

Do not create live GitHub delivery objects from an unapproved assessment.

## Repository hygiene and branches

- Preserve unrelated work and inspect the branch, worktree, staged diff, and
  base-to-head diff before delivery.
- Never commit credentials, secrets, private keys, populated environment files,
  or unapproved personal or production data.
- Use the branch naming convention accepted during setup or in the Delivery
  Assessment.
- A standalone or integration pull request normally targets the configured
  trunk; a multi-PR child normally targets its integration branch.
- Verify the exact head and base before pushing, opening, updating, or merging a
  pull request.
- Do not rewrite a published shared branch, force-push reviewed history, or
  delete a branch or worktree without explicit authority.
- Review the staged diff for sensitive content before every push.

## Commits

- Keep each commit focused, independently understandable, and revertable where
  practical.
- Include relevant tests with behavioral implementation when practical.
- Do not mix unrelated cleanup into a feature commit.
- Derive commit and push reports from repository history and the complete diff,
  not memory.
- Never add an agent or automation tool as co-author.

Use the commit convention accepted during setup. Link material delivery to its
Project or GitHub issue through the pull request and delivery records; do not
add noisy ticket syntax to every mechanical commit.

## Pull requests are human review surfaces

Use [`.github/pull_request_template.md`](../../.github/pull_request_template.md)
for every pull request and write it according to
[`../voice.md`](../voice.md). CI is evidence, not the primary reader.

A pull request should let a human determine:

- what changed and why;
- the Project specification and GitHub issue that authorize it;
- what behavior existed before and what observable result changes;
- the main files and contracts to inspect;
- what is intentionally out of scope;
- the exact comparison base and head;
- the applicable acceptance, lifecycle, migration, isolation, data, and
  environment context;
- exact validation commands, results, failures, and skipped proof; and
- remaining risk and follow-up ownership.

Derive the description from the pull-request template, Project specifications,
repository history, the actual base-to-head diff, and validation evidence. A
child or standalone pull request links its owning issue. An integration pull
request includes the synchronized generated delivery view defined in
[`multi-pr-delivery.md`](multi-pr-delivery.md).

Do not merge because implementation is complete or CI is green. Required
review, validation, merge preconditions, readiness, and human gates apply to the
exact candidate.

## GitHub command adapter

Use the GitHub interface configured by the repository. Before a mutation,
verify the target repository and object. Use a real UTF-8 file when the adapter
requires a body file, preserve human-authored content, and read the saved object
back before reporting completion.

Do not assume one adapter accepts another tool's flags or preserves content
losslessly. Use the narrowest documented fallback when the configured adapter
cannot perform an operation and disclose the fallback.

### Preserve generated regions without rewriting human text

For a delivery-view update that must preserve everything outside named markers:

1. create a task-scoped temporary directory and generated-region file;
2. fetch the complete current issue or pull-request body through a lossless
   read interface;
3. replace only the named generated marker region in a temporary full-body
   copy;
4. write the complete result through the configured adapter; and
5. fetch the saved body losslessly and compare the generated region before
   reporting success.

If a read-back mismatch or concurrent edit changes the generated region,
regenerate it from canonical GitHub metadata. Report human-authored content
found inside generated markers before overwriting it.

## Merge methods preserve evidence and history

Choose and approve the merge method from the delivery shape before the pull
request is ready to merge. Unless setup approves another evidence-preserving
policy, use these defaults:

- Squash an ordinary direct-repository pull request into the configured trunk
  so one reviewable change becomes one trunk commit.
- Merge an exact-candidate `single-pr` Project pull request with a merge commit
  so its validated head remains a parent of the trunk result.
- Squash each `multi-pr` child into its integration branch so the assembled
  history has one commit per reviewed slice.
- Merge the final integration pull request with a merge commit after verifying
  that its head is the exact assembled and validated candidate.

Do not rebase-merge reviewed delivery when that rewrites identities used by
validation or approval evidence. If the repository selects another method,
record how it preserves or remaps candidate identity. Before merge, re-check
the base, head, approval, terminal checks, selected method, and Project-specific
gates. GitHub remains the live owner of the merge event and resulting commit.

## Checks and delivery truth

- Derive required check names from live GitHub configuration and executable
  repository workflows; do not guess them from documentation.
- Treat a pending check as incomplete validation, not success or failure.
- A gate that requires CI remains incomplete until the check reaches a terminal
  state or the human explicitly changes the proof requirement.
- Report the exact head, check state, run links, failures, cancellations,
  skipped gates, and unavailable evidence.
- Re-check GitHub before merge and the deployment platform before release.

## Traceability and human gates

- Project records link specifications, delivery assessments, GitHub issues and
  pull requests, and applicable external release evidence without copying live
  status.
- The implementation pull request or commit identifies the candidate. Its
  validation section, linked terminal checks, and review findings record
  evidence for the exact head and comparison base.
- GitHub workflow and environment records, the deployment platform, and any
  owning release-proof issue identify production authorization, released
  source and artifact, target, and production verification.
- Lessons link their evidence and the canonical source they changed.
- Merge requires the configured eligible approval and every Project-specific
  gate for the exact candidate.
- Production release requires explicit human authorization after applicable
  findings and risks are disposed, regardless of merge or non-production
  success.

# GitHub delivery rules

Shared rules for commits, pull requests, and release traceability.

## Configuration state

GitHub owns live repository visibility, settings, pull requests, and checks. Re-check them before relying on this recorded configuration.

Repository URL, visibility, protected branches, pull-request requirement, approving-review count, merge method, commit convention, and production-release owner are setup decisions. Record them through [`../../setup/questionnaire.md`](../../setup/questionnaire.md) before the first Project commit or live GitHub delivery action.

- Use `.github/pull_request_template.md` for every pull request once pull-request delivery is configured.
- Derive required check names from the approved Technical Specification, executable test commands, and CI configuration. Record them here before the first Project pull request is merged.
- Do not copy GitHub settings from the template description. Apply and verify them in the instantiated repository.

## Sources of truth

- The Project and approved specifications own intended behaviour.
- Git owns code history.
- GitHub owns live pull request and check status.
- The deployment platform owns live release status.

Re-check live state before merging or releasing.

## Repository hygiene

- Never commit credentials, secrets, private keys, or populated environment files. Store secret values in an appropriate local, GitHub, deployment, or service secret store; record only safe setup requirements and variable names.
- Do not commit unapproved personal or production data. Use synthetic, anonymized, or otherwise approved data according to [`testing-rules.md`](testing-rules.md).
- Review the staged diff for sensitive content before every push.

## Delivery profile

Every Project selects one profile through its approved Delivery Assessment before Build:

- `single-pr` — use when one pull request can be reviewed, validated, and released safely; target `main` directly.
- `multi-pr` — use when several independently reviewed pull requests must be assembled before the Project has value; follow `multi-pr-delivery.md`.
- `undecided` — allowed during Spec & Design and Assess Delivery, but not when Build begins.

Recommend `multi-pr` when two or more are true:

- several pull requests must work together before the result is useful;
- the assembled result needs shared-environment or end-to-end validation;
- delivery slices have blockers or a required merge order;
- explicit human review or release gates apply;
- merging slices directly to `main` would expose incomplete behaviour;
- parallel delivery lanes must converge on one integrated proof.

The human approves the profile and proposed delivery shape before implementation begins. Do not create live GitHub delivery objects from an unapproved assessment.

## Commits

- Keep each commit focused, traceable and easy to review and follow along.
- Preserve unrelated work.
- Link material code changes to the relevant Project or specification.

Commit naming convention: Setup required before the first Project commit.

## Pull requests

Fill out `.github/pull_request_template.md` for every pull request.
Write the description according to [`../voice.md`](../voice.md).

Main branch policy: Setup required before the first Project commit.

Branch naming convention: Setup required before the first Project branch is published.

Merge method: Setup required before the first Project pull request is merged.

Required checks: Not yet nameable. Record them before the first Project pull request is merged, after the technical stack, executable test commands, CI configuration, and live check names exist.

## Traceability

- Build and validation summaries link to the relevant commit or pull request.
- Release summaries link to the released commit, pull request, and deployment evidence.
- Lessons link to their evidence and to the source they changed.

## Human gates

Required approval before merge: Setup required. Base the rule on who has merge access; do not require an approval that no eligible reviewer can provide.

Required approval before production release: Explicit human authorization for the exact candidate, as required by [`06_release`](../../workflows/06_release/CONTEXT.md). Name the owner during setup or in the first applicable Technical Specification.

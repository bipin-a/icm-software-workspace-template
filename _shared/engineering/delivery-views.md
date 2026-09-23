# Generated GitHub delivery views

Use only for explicitly selected GitHub multi-PR coordination. GitHub issue
bodies own the structured fields below; PR state comes from GitHub. The living
brief links the parent issue and integration PR. Do not copy changing state
into a local manifest. This implementation targets github.com and uses the
installed, authenticated `gh` executable.

## Preview and publish

Run `node tools/icm/delivery.mjs --repo owner/repository --parent 123` to read
live state and print the generated view and proposed body changes. This is
read-only. After reviewing the concrete changes within the authorized delivery
scope, repeat with `--publish` to update the parent issue and integration PR.
The switch requests a write; it is not evidence of human authorization.

The tool validates identities, PR targets, missing blockers, and cycles before
writing. It re-reads the source snapshot, checks each target body immediately
before writing, and reads each saved body back. It replaces only the region
between `icm-delivery-view:start` and `icm-delivery-view:end` HTML comments,
appending a region when none exists. Duplicate or unmatched markers stop the
operation. Human prose outside that region is preserved.

GitHub body updates and the two-object publication are not atomic. A concurrent
edit between the final read and write remains a race; coordinate editing during
publication. On failure, inspect the reported verified updates and both live
bodies. A timed-out write may have applied. Re-preview and republish to reconcile
from current GitHub state; do not blindly restore an older body or copy one
view over the other. An unchanged view causes no write.

## Parent issue metadata

Use exactly one block in the parent issue body, outside the generated region:

```text
<!-- icm-delivery
{"integrationPullRequest": 124, "baseBranch": "main", "issues": [125, 126]}
-->
```

Numbers identify real objects in the explicitly selected repository. The
integration PR head must be a branch in that repository and its base must be
the declared trunk. The `issues` array is the canonical slice inventory;
there is no second native-subissue inventory to synchronize. Links and normal
GitHub labels can aid navigation but do not override these fields.

## Slice issue metadata

Keep acceptance, proof obligations, and reasoning in the owning brief or linked
decision document. Each slice issue names its observable outcome and those
links, then carries exactly one block outside any generated view:

```text
<!-- icm-slice
{"priority": 1, "blockedBy": [], "pullRequest": null, "releaseBlocking": true, "owners": ["app/search"], "mergeConditions": ["Focused review and proof complete"], "humanGates": [{"phase": "build", "question": "Choose the query owner"}]}
-->
```

- `priority`: positive integer; smaller values sort first. It is not a blocker.
- `blockedBy`: prerequisite issue numbers from the parent's inventory. Add the
  prerequisite to that inventory before referring to it. External prerequisites
  require an explicit local tracking issue linked to their actual owner.
- `pullRequest`: the slice PR number, or `null` before publication or for work
  that needs no PR. A child PR belongs to one slice and targets the integration
  branch. Update the issue when a PR is replaced.
- `releaseBlocking`: whether completion is required for the planned release.
- `owners`: repository-relative file or directory owners affected by the slice.
  The view detects exact and directory-prefix overlaps among frontier items;
  absence of a declared overlap does not prove safe concurrency.
- `mergeConditions`: outstanding conditions, distinct from technical blockers.
  Clear them only from reviewed evidence; the tool does not judge them.
- `humanGates`: outstanding questions with `phase` equal to `build`, `merge`, or
  `release`. Record the actual answer at its existing owner before removing a
  gate. An empty list or a completed issue never grants merge/release authority.

Close completed work with GitHub's completed reason. A closed issue satisfies a
blocker only when its reason is completed and its linked PR, if any, is merged
into the integration branch. Cancelled work continues to block until the human
resolves the dependency. A merged PR alone does not claim the whole issue is
done. Stale conditions and questions remain visible until disposition.

## What the view means

The development frontier contains open slices whose blockers are complete,
whose linked PR has not been closed, and which have no outstanding build gate.
It is an eligibility projection, not permission to merge or deploy. A merged
PR with an open issue must be reconciled before further implementation.

The diagram shows declared dependency edges. The critical-path projection is
the longest remaining chain by slice count leading to release-blocking work,
not an elapsed-time forecast. It chooses one longest chain when lengths tie.
Independent work may proceed only after checking file, decision-owner, and
runtime overlap beyond these declarations.

Refresh after issue/PR publication, blocker or priority changes, child merges,
repairs, deferrals, and human decisions. A repair or investigation that changes
the delivery graph is a real slice, not a hidden comment. Recheck live required
checks and human authority separately before every merge.

## API boundary

The adapter uses GitHub's [issue get/update endpoints](https://docs.github.com/en/rest/issues/issues)
and [pull request endpoint](https://docs.github.com/en/rest/pulls/pulls), with
API version `2026-03-10`. Bodies are sent as JSON through stdin, not interpolated
into shell commands. Authentication stays with `gh`; no token is stored in
Project files. Tests exercise the API boundary with simulated responses and
failures; they do not claim live publication has been exercised.

# Review of living decisions

- Chat or the PR records human authority.
- A Project keeps one living `PROJECT.md` brief; split a decision into another document
  only when size or ownership warrants it.
- Link that owner instead of repeating it and list its Project-relative path in
  `decision_documents` frontmatter.
- `PROJECT.md` is always included. A declared `context_packets` JSON manifest is
  also compared, because selector changes can alter which evidence is loaded.
- No separate approval receipts or manually stored `reviewed` or `approved` status are
  used for this workflow.

## Review and change

1. **Reuse existing authority.**
   - Use explicit authority from the current conversation.
   - When review is needed, present the concrete effect, recommendation, and
     sacrifice in chat.
   - Routine authorized work does not wait for another approval.
2. **Record the source of review.**
   - The PR review or decision comment names the exact reviewed commit and
     documents, the human source, and the approved scope.
   - Preserve the original chat source when carrying a decision into the PR.
   - Recording the decision creates no new authority and requires no new review.
3. **Compare before relying on a review.**
   - Read the actual review source.
   - Compare current documents with the reviewed revision, including added,
     changed, and removed decision documents.
   - An unchanged comparison preserves review only within its actual scope.
     It does not prove approval or permit deployment.
4. **Classify changed wording from the diff.**
   - Material decision change: affected review becomes stale; obtain the
     relevant authority.
   - Purely editorial change: authority remains valid; record the specific
     disposition and compared revisions on the same PR.
   - Uncertain classification: keep it pending.
   - Do not classify every edit as editorial or re-review unrelated decisions.

## Mechanical comparison

- `node tools/icm/workspace-check.mjs --project <slug> --reviewed-commit <sha>` checks
  the brief and compares all declared decision documents with a commit obtained from the
  actual review source.
- It compares staged and working-tree edits, so restoring a working file cannot conceal
  a changed staged version.
- A change fails the comparison and names the files to inspect; it cannot classify
  meaning or verify a human source.
- After an editorial disposition, compare against that disposition's commit.
- A caller-supplied commit or green check alone is not review.

- Without `--reviewed-commit`, the checker validates structure and links only.
- For bounded work with no Project brief, apply the same comparison to the decision text
  on its owning chat/PR; do not create a Project merely to run this command.

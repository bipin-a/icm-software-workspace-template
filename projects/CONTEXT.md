---
type: project-library-router
status: active
---

# Projects

One job: select a Project and route its next unresolved decision.

1. For a named Project, read only `projects/<project-slug>/PROJECT.md`.
2. For new work, use the [feature workflow](../workflows/feature/CONTEXT.md).
   Keep bounded work in chat and the PR. Create a brief from
   [`_templates/project/`](../_templates/project/PROJECT.md) only when durable
   coordination needs it; fill `id` with the directory slug and `title` with
   the outcome. Use one Project branch under
   [Delivery profiles](../_shared/engineering/github-delivery-rules.md#delivery-profiles).
3. Require `workflow: feature-work`. Correct an unknown value; never infer a
   route from filenames or relabel existing work to evade a review obligation.
4. Read only the brief and linked decision owners relevant to the current
   question. Follow [document review](../_shared/engineering/document-review.md).
5. Continue authorized implementation and sufficient proof in the same task.
   Add work ordering or release details only when they affect a decision.
6. Read live issues, PRs, checks, reviews, and deployments through the exact
   links in the brief. Report which live owner was checked and when, or state
   that live state was not checked.

A brief owns intent and decisions. It contains no manually maintained approval
status or progress log. `PROJECT.md` is always compared during revision review;
list any additional Project-relative Markdown decision paths in
`decision_documents` without repeating `PROJECT.md`.

Do not scan every Project or infer ownership of an unlinked issue or branch.

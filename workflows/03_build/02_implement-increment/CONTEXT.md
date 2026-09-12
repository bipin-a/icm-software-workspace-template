---
type: workflow-step
context:
  profile:
    path: _shared/engineering/profiles/direct-repository.md
    heading: direct-repository
  inputs:
    - path: projects/<project-slug>/PROJECT.md
      headings: [Product behavior, Technical choices, Acceptance and proof, Open questions]
---

# 02_implement-increment — Implement one coherent increment

One job: complete an observable part of the accepted outcome with focused proof.

## Inputs

- Current chat/PR decisions and explicit authority. For a selected Project, use the manifest’s brief sections and the linked decision owners relevant to this step. Bounded work does not require a Project.
- The selected branch, exact base, current diff, and only the application and test owners needed for this increment.
- For coordinated delivery, the selected linked item and its current blockers.

Do not load unrelated Projects, other substeps, or complete reference libraries.

## Process

1. Verify the criterion, accepted decisions, branch, base, current changes, and blockers. Preserve unrelated work and use the active worktree dependency configuration when needed.
2. Trace the public behavior and canonical owners. Reuse existing mechanisms and proof before adding another path.
3. For a regression or high-risk change, demonstrate the distinguishing failure before fixing it. For ordinary work, choose proof from the acceptance and credible risks.
4. Implement the smallest complete outcome, run its focused checks, and inspect the full increment diff. Commit when delivery is in scope; keep the change coherent and reversible.
5. Record exact commands, results, candidate identity, omissions, and remaining work on the owning chat/PR. Continue another increment or publication within the requested scope.

## Outputs

- The implemented increment and focused proof, with exact revision or working-tree identity and remaining work.

## Human check

Continue clear authorized implementation. Resolve a material product or technical contradiction with its decision owner before dependent changes; a substep boundary alone does not require approval.

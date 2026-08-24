# 04_validate — report evidence about the candidate

One job: compare the exact candidate against the approved specifications and report the evidence. Validate does not fix code or specifications and does not decide whether to release.

## Inputs

- Working: `../../projects/<project-slug>/PROJECT.md`
- Working: `../../projects/<project-slug>/specs/product-spec.md`
- Working: `../../projects/<project-slug>/specs/technical-spec.md`
- Working: `../../projects/<project-slug>/delivery-assessment.md`
- Working: `../../projects/<project-slug>/summaries/build-summary.md`
- Working: the exact code or build identified by the build summary
- Reference: `../../_shared/engineering/testing-rules.md`
- Reference: `references/review-rules.md`
- Reference only when `delivery_profile: multi-pr`: `../../_shared/engineering/multi-pr-delivery.md`
- Template: `../../_templates/summaries/validation-summary.md`

Do not assume current code, test, or environment state from an old summary. Verify it again when needed.

## Process

1. Identify the exact candidate. For a pull request, obtain live metadata, changed files, head SHA, and exact diff; verify the local checkout matches and has no overlapping dirty changes.
2. Identify each evidence environment and its data source, type, version or baseline, reset state, and important differences from production.
3. Map each acceptance criterion and material risk to observable proof.
4. Perform the mandatory baseline review, then select only the conditional review angles earned by the change.
5. Test the relevant lifecycle states, including change, reversal, reload, and partial failure.
6. For multi-PR delivery, validate the assembled integration branch rather than relying only on child pull request results.
7. Perform human-in-the-loop UI/UX review when relevant. If browser behaviour is part of the contract, use the Project-defined real-browser proof method.
8. Record what each class of evidence establishes and does not establish. Do not present controlled local, mock-data, or staging evidence as proof of real-world adoption.
9. Record each observation, evidence, specification relationship, why it may matter, a concrete example, possible responses and costs, and the decision owner.
10. Separate facts, interpretation, recommendations, and skipped checks.

## Outputs

- `../../projects/<project-slug>/summaries/validation-summary.md`

## Human check

Confirm that the evidence and finding descriptions are complete, then continue to Assess Readiness. This check does not approve release or choose fixes.

## Skill routing

- Use `code-review-and-quality` before readiness assessment.
- Use `doubt-driven-development` for non-trivial or high-stakes claims.
- Use `code-simplification` when unnecessary complexity is a material concern.
- Use `security-and-hardening` when security or privacy is in scope.
- Use `performance-optimization` when performance is part of the contract or risk.

Use right-sized review agents and angles; do not run every reviewer by default. Delegated findings are evidence, not authority.

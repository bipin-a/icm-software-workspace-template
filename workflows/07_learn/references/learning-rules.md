# Learning rules

Configure the factory, not the product, when the same workflow could reproduce the failure across Projects.

A lesson records durable understanding after evidence is available. It does not replace time-sensitive containment, rollback, recovery, or restoration while harm remains active.

| Cause | Correct owner |
|---|---|
| Product intent was wrong or incomplete | Product Specification |
| Technical decision changed | Technical Specification or ADR |
| Cross-Project architecture decision changed | Shared ADR plus links from affected Technical Specifications |
| Workflow step was missing or unclear | Stage `CONTEXT.md` |
| Relevant context was not loaded | Root or stage routing |
| A recurring output was missing structure | Template |
| Durable cross-Project judgment changed | Shared principle |
| Validation missed a class of evidence | Validation rules |
| Human or agent input was contradictory, rushed, or assumed | Intake, assumption, or approval gate |
| Future direction is plausible but not current scope | Roadmap |
| Clear controls existed but execution failed once | Lesson; strengthen enforcement only when justified |

- If a rule was absent, add it.
- If it was ambiguous, clarify it.
- If it was not loaded at the right time, fix routing.
- If it was clear but ignored, consider an enforcement check or gate instead of repeating the wording.
- Keep the lesson as evidence; put durable instruction in its canonical owner.
- Describe bad human input as an input-contract failure, not as blame.
- Change the shared factory only when recurrence is credible across Projects.
- When no source should change, preserve the evidence and state why additional
  policy would not prevent recurrence.

# Factory definition of done

Humans own product intent, material technical choices, acceptance, readiness,
and production authorization. Agent work supplies drafts, implementation, and
evidence; it does not replace those decisions.

## Finished Project workflow

Completion follows the requested scope. A local implementation or documentation
task does not require production release; mark deployment obligations below not
applicable with that scope reason. When release is requested, retain them.

A Project workflow is done when:

- the change matches the accepted outcome and decisions in the owning chat/PR
  or Project brief and its linked decisions;
- implementation, migrations, documentation, and configuration agree on their
  canonical owners, with no competing legacy path left active;
- validation identifies the exact candidate, environments, data sources,
  results, failures, and skipped proof in the pull request, terminal checks,
  review evidence, or another canonical delivery record;
- applicable repository checks, testing rules, and safeguards pass, or each
  exception has an explicit human disposition;
- every material finding has a human disposition on the owning pull request,
  issue, or configured approval surface for the exact candidate;
- a human explicitly authorizes production release after reviewing known risks
  and rollback and monitoring obligations;
- the production result is verified; and
- the Project links the implementation and applicable GitHub, check,
  deployment, and production evidence without copying their live state, with
  any earned lesson applied to its canonical source.

- A merged pull request, green CI run, or successful non-production deployment is not,
  by itself, a finished Project workflow.
- Documentation-only and mechanical changes may mark behavioral testing not applicable,
  but they must still provide structural evidence for the claimed result.

Apply the repository's canonical
[testing rules](engineering/testing-rules.md),
[GitHub delivery rules](engineering/github-delivery-rules.md), and
[safeguards](engineering/safeguards.md). For work split across several pull
requests, also apply the
[multi-PR delivery rules](engineering/multi-pr-delivery.md).

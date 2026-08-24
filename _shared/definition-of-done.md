# Factory definition of done

Configure the workspace audience, human decision owners, and any stricter completion constraints through [`../setup/questionnaire.md`](../setup/questionnaire.md). Until that questionnaire is complete, this file is a baseline rather than an approved repository-specific definition.

Humans own product intent, material technical choices, acceptance, readiness, and production authorization. Agent work supplies drafts, implementation, and evidence; it does not replace those decisions.

## Finished workflow run

A Project workflow run is done when:

- the released change matches the human-approved Product and Technical Specifications;
- validation identifies the exact candidate, environments, data sources, results, failures, and skipped proof;
- the readiness decision disposes of every material finding and approves the exact release candidate;
- the human explicitly authorizes production release after reviewing the known risks and rollback and monitoring obligations;
- the production result is verified; and
- the Project's build, validation, readiness, and release records link to the evidence, with any earned lesson applied to its canonical source.

A merged pull request or successful non-production deployment is not, by itself, a finished workflow run.

Follow the configured environment and iteration sequence in [`engineering/testing-rules.md`](engineering/testing-rules.md), the workflow gates in [`../CONTEXT.md`](../CONTEXT.md), and the release contract in [`../workflows/06_release/CONTEXT.md`](../workflows/06_release/CONTEXT.md).

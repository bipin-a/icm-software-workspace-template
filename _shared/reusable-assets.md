# Reusable external inputs

This file registers approved external inputs that future Projects may reuse. It
is a catalog, not a second copy of their contents. Internal shared references
are routed by [`CONTEXT.md`](CONTEXT.md); blank artifacts live under
[`../_templates/`](../_templates/).

## Available now

No external data source, prior product artifact, design reference, provider
environment, or other external reusable input is registered in the template.
Add or explicitly decline external inputs during
[`../setup/questionnaire.md`](../setup/questionnaire.md).

## Admission rule

Add an input only when its canonical location, owner, intended use, access
constraints, and freshness expectations are known. Link it from the workflows
or Projects that need it; do not copy it into several Projects. Record only safe
access requirements and variable names. Never store credentials here.

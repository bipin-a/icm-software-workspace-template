---
type: workspace-router
status: active
---

# ICM software workspace

This repository contains a configurable software-delivery factory and the
product workspace created from it. This file routes work; it does not own
product intent, workflow procedure, or changing delivery state.

## Setup gate

Read [`setup/questionnaire.md`](setup/questionnaire.md) first. When its status
is not `complete`, route to [`setup/CONTEXT.md`](setup/CONTEXT.md) before
creating or advancing a Project. Maintaining the reusable template itself is
the only exception; leave the questionnaire incomplete in the template source.

## Route by task

| Need | Start here |
|---|---|
| Select, create, continue, or report a Project | [`projects/CONTEXT.md`](projects/CONTEXT.md) |
| Follow the Project delivery stages | [`workflows/CONTEXT.md`](workflows/CONTEXT.md) |
| Select stable shared rules or references | [`_shared/CONTEXT.md`](_shared/CONTEXT.md) |
| Configure the factory | [`setup/CONTEXT.md`](setup/CONTEXT.md) |
| Record a future direction that is not yet a Project | [`roadmap/CONTEXT.md`](roadmap/CONTEXT.md) |
| Investigate cross-Project architecture with no natural Project owner | [`architecture/CONTEXT.md`](architecture/CONTEXT.md) |
| Work in the application or selected source tree | [`app/README.md`](app/README.md) and the configured repository instructions |
| Maintain this reusable profile | [`README.md`](README.md) and the [methodology reference](_shared/methodology/interpretable-context-methodology.md) |

Discussion, diagnosis, or research with no durable consequence may remain in
conversation. When it changes accepted work, reconcile the evidence into its
one canonical Project, roadmap, workflow, architecture, or shared owner.

For Project status, begin with its stable record and exact artifact links.
Repository files own durable context and accepted decisions. Git, pull-request
and check systems, configured approval surfaces, and deployment providers own
their changing live state. Follow exact links and re-check those owners instead
of copying or inferring current status.

## Human check

Confirm the setup state, selected Project or direct repository task, canonical
owner, and exact external system before changing a file or live system.

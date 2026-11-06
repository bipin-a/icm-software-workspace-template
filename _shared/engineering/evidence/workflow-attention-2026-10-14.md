# Attention between workflow phases — 2026-10-14

This is parked background research on effort allocation between ICM stages.
It establishes no execution rule or planned trial. Normal engineering work does
not need to load this note. Revisit it when a concrete case shows effort going
to the wrong stage.

The question is whether stages should receive different amounts of effort,
and on what basis. Here, **attention** means allocation of agent computation,
investigation, review, or human involvement. It does not mean the attention
operation inside a transformer. The research below directly addresses the
computation part; applying it to human involvement requires a separate test.

## Primary research

### ZEBRA: direct evidence about allocation between phases

[ZEBRA](https://arxiv.org/abs/2605.20485) is a May 2026 arXiv preprint;
no venue is recorded. An LLM estimates phase utility curves; a solver allocates
budgets. Coding favors refinement; question answering receives a near-balanced
split and statistically ties uniform allocation. Task-specific allocation
beats a fixed average in most tested medium/hard coding conditions. Limits:
selected benchmarks, fixed phase/model combinations, and substantial controller
overhead. Monetary shares reflect model prices as well as effort. Allocation
happens before execution; a tested mid-pipeline reallocation variant did not
improve ZEBRA. See [results and limitations](https://arxiv.org/html/2605.20485v1#S5).

### LLM-as-Scheduler: evidence about when later work is useful

[LLM-as-Scheduler](https://aclanthology.org/2026.acl-long.581/) was published
in ACL's July 2026 long-paper proceedings. A lightweight gate evaluates
intermediate outputs, and an LLM scheduler routes work to completion,
testing, or refinement. Compared with a fixed workflow, the paper reports
lower token use and latency with a small accuracy reduction. Its ablation
shows that a cheap gate alone saves work but loses more accuracy. This
supports considering current evidence when deciding whether to spend more
effort. Limits include benchmark-specific calibration and uncertain transfer
to other tasks, models, and tools. It does not establish that required
software checks can be skipped. See [results and limitations](https://aclanthology.org/2026.acl-long.581.pdf).

### BAMAS: related evidence about resource and collaboration choices

[BAMAS](https://ojs.aaai.org/index.php/AAAI/article/view/40226) was published
in AAAI proceedings on 2026-03-14. It combines constrained model selection
with a learned choice of collaboration structure. Across coding and math
benchmarks, it reports comparable performance at lower cost than comparison
systems. This is evidence that resource selection and collaboration structure
matter jointly. Its target is the model team and its interactions, rather
than the importance of lifecycle stages. It therefore supplies supporting
context, not validation of weights for ICM's Understand, Design, Build,
Validate, Assess Readiness, Release, and Learn stages.

## What this establishes

These sources give a concrete research basis for investigating conditional
effort allocation. Their vocabulary is budget allocation, dynamic scheduling,
and resource allocation. None of the inspected studies validates a permanent
importance ranking for the seven ICM stages or measures human review effort
across that lifecycle.

For an ICM proposal, distinguish three quantities: how consequential a stage's
failure would be, how much useful evidence it already has, and how much the
next increment of effort could improve the outcome. Treating them as one
number would hide material differences. This distinction is a proposed local
interpretation, not a finding directly tested by the papers.

## ICM and practitioner evidence

The [ICM paper, sections 4.5–4.6](https://arxiv.org/html/2603.16021#S4.SS5),
a March 2026 preprint, reports that 30 of 33 practitioners described heavier
human editing at the beginning and end of staged workflows. Early editing
set direction; late editing checked alignment. These were informal,
self-selected reports, mostly from content production, without a controlled
comparison. They motivate a hypothesis about human attention; they do not
establish the best allocation for software delivery. The local
[methodology notes](../../methodology/interpretable-context-methodology.md#human-review-findings)
already preserve that distinction.

Anthropic's June 2025 engineering post,
[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system),
describes explicit effort guidelines keyed to query complexity, bounded
delegation, and checking whether further research is needed. It is first-party
engineering experience with research agents, not a controlled study of the
seven software stages.

Anthropic's September 2025 post,
[Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
uses the term "attention budget" for finite context and recommends selecting
high-signal information. That concerns what enters an agent's context; it does
not supply weights for allocating work across phases. Context selection,
computation, and human review should remain distinguishable.

## Fit with the current template

The [workflow router](../../../workflows/CONTEXT.md#stages) already selects the
earliest unresolved stage, reuses completed decisions, and revisits affected
proof. [Decision work](../decision-work.md) already owns proportionate
investigation, stop conditions, and acting within authority.
[Context packets](../context-packets.md) scope declared inputs while preserving
required context. Most of the proposed Focus/Action/Stop instruction already
exists in these owners.

## Assessment after review

This investigation identified no concrete case of effort going to the wrong
stage in this workspace. The papers support conditional allocation in general;
they do not validate an additional instruction here. Without a demonstrated
failure and a distinct intervention, a trial would have little basis for a
discriminating result. No trial was run or is proposed now.

The proposed broadening of the feasibility bullet was reverted. Existing
decision-work and human-call guidance already cover unresolved product and
ownership choices. No demonstrated gap justifies repeating that guidance here.

Retain the research as parked background until a real case supplies the
missing problem. Human involvement remains governed by
[human-call](../../../.agents/skills/human-call/SKILL.md); additional agent work
cannot substitute for a human decision.

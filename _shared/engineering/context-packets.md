# Scoped context packets

Use this optional tool when selecting a living brief's sections and prerequisite
owners repeatedly becomes difficult. It assembles declared evidence; it does
not decide what to ask, infer human authority, or replace `human-call`.

## Assemble

Run `node tools/icm/context-packet.mjs --project <slug> --stage
workflows/04_validate/CONTEXT.md`. The JSON output includes
source paths, selected headings, full selected text, and estimated size.

The baseline includes agent entry files, voice, decision work, principles, the
exact stage, brief intent and open questions, the stage's declared brief inputs,
and the unconditional rows of its Rules table. Conditional headings are added
only through repeated `--rule <exact-heading>` selections. Conditional
`whole file` rows are added through repeated `--selector <repository-path>`
options. The output lists every conditional whole-file row and whether it was
selected; execute-only tools are identified and checked for existence without
loading their code. Choose
those headings from the actual task triggers; the tool cannot infer them.

Without additional selectors, the tool includes all declared context nodes.
Use `--criterion <id>`, `--environment <id>`, or `--work-item <id>` to select a
bounded packet. A criterion/environment matches its named nodes plus `All`;
a work item selects itself and its transitive prerequisites. Prerequisites
remain included even when they have another criterion or environment.
Contradictory selectors, unknown IDs, cycles, missing dependencies, and missing
or ambiguous headings fail. Size overages warn in the output; text is never
silently trimmed.

## Optional Project declaration

Keep one living `PROJECT.md`. Add `context_packets: context-packets.json` to
its frontmatter only when scoped selection is needed, and link the manifest
from the brief. The JSON holds selection metadata, never copied decisions,
approval, or live delivery state. Input paths are repository-relative. Other
Project inputs and paths outside the repository are rejected.

For example, a Project can declare:

```json
{
  "schemaVersion": 1,
  "nodes": [
    {
      "id": "query-owner",
      "criteria": ["All"],
      "environments": ["All"],
      "dependencies": [],
      "inputs": [{"path": "projects/search/decisions.md", "headings": ["Query ownership"]}]
    },
    {
      "id": "search-results",
      "criteria": ["matching-results"],
      "environments": ["dev", "production"],
      "dependencies": ["query-owner"],
      "inputs": [{"path": "projects/search/decisions.md", "headings": ["Matching results"]}]
    }
  ]
}
```

The referenced documents must already contain real decisions and be linked
from the brief; declare decision documents through its existing
`decision_documents` field. Do not create separate specifications or approval
receipts. Change the selectors when the actual evidence dependencies change.
Workspace and selected-Project checks validate declared manifests. Reviewed-commit comparison also includes the manifest, including staged edits.
Review manifest diffs with the decision changes they select; their existence or a
successful packet does not establish that the selected evidence is sufficient.

The assembler retains the stage's required baseline even if it overlaps a
selected node. This favors complete obligations over the smallest possible
packet. It does not fetch chat, code, runtime results, or GitHub state; gather
those separately when the next action requires them.

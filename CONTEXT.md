# Software Project workflow

One shared Pipeline updates lightweight Project records stored under `projects/`. Complete [`setup/questionnaire.md`](setup/questionnaire.md) before creating the first Project.

| Stage | Job | Main output | Human check |
|---|---|---|---|
| `01_spec-design` | Define product and technical intent | Project specifications | Approve both specifications |
| `02_assess-delivery` | Compare delivery trade-offs | Delivery assessment | Choose the delivery shape or route back |
| `03_build` | Implement the approved specifications | Code and build summary | Review the change |
| `04_validate` | Report evidence against the specifications | Validation summary | Confirm the evidence is complete |
| `05_assess-readiness` | Decide how to handle validation findings | Readiness decision | Approve the disposition and route |
| `06_release` | Release an approved build | Release summary | Confirm the released result |
| `07_learn` | Capture and apply lessons | Lessons file and source updates | Confirm each lesson's owner |

## Factory references

- Factory configuration: [`setup/questionnaire.md`](setup/questionnaire.md)
- A finished workflow run: [`_shared/definition-of-done.md`](_shared/definition-of-done.md)
- Approved reusable inputs: [`_shared/reusable-assets.md`](_shared/reusable-assets.md)

## Routing

- Unconfigured factory → `setup/CONTEXT.md`
- Discussion, diagnosis, or research with no durable consequence → remain in conversation; when it changes durable work, reconcile the evidence into its canonical Project, roadmap, workflow, or shared source
- Future direction that is not ready to become a Project → `roadmap/future-features.md`
- New idea or changed behaviour → `workflows/01_spec-design/CONTEXT.md`
- Approved specifications → `workflows/02_assess-delivery/CONTEXT.md`
- Approved delivery assessment → `workflows/03_build/CONTEXT.md`
- Built change → `workflows/04_validate/CONTEXT.md`
- Complete validation evidence → `workflows/05_assess-readiness/CONTEXT.md`
- Approved release candidate → `workflows/06_release/CONTEXT.md`
- Meaningful factory, Project, input, execution, or external lesson → `workflows/07_learn/CONTEXT.md` from any stage
- Cross-cutting architecture uncertainty that blocks a decision → `workflows/architecture-spike/CONTEXT.md` from any stage

The user may route back to an earlier stage whenever evidence changes the Project. A Build → Validate → Assess Readiness loop may repeat several times before Release; it remains one Project lifecycle and uses numbered candidate iterations.

## Interrupt workflow

`architecture-spike` is a human-routed interrupt, not a numbered lifecycle stage. It frames one decision, gathers only the evidence needed, and returns the sponsoring and affected Projects to the earliest invalidated stage.

Use a sponsoring Project's `spikes/` folder by default. Use `architecture/spikes/` only when no Project is the natural evidence custodian.

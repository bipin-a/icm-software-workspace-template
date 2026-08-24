# Specification rules

## Specification authority

- Each Project has one current Product Specification and one current Technical Specification.
- Product Specifications own user and product behaviour.
- Technical Specifications own how the system makes that behaviour true.
- Product Specifications distinguish observed evidence from assumptions and state why the Project matters now.
- Success signals distinguish what can be checked before release from later real-world signals when those matter.
- Technical Specifications define the environments, data scenarios, reset method, privacy constraints, and evidence limits needed to validate the intended behaviour.
- Search for existing or overlapping specifications before creating new ones.
- Draft alternatives may exist temporarily, but only one reconciled pair can be approved.
- When a specification changes, review every downstream artifact that declares it as an input.
- Superseded specifications remain linked for history but are not acted on as current intent.

## Interface evidence

- For a Project that creates or changes human-facing behaviour, establish and review the affected interface surfaces, flows, states, and failure conditions before committing new backend interfaces, persistence choices, or service boundaries.
- Use the least expensive evidence that faithfully answers the product question. When a suitable frontend already exists, prefer reusing its application shell, routes, components, design system, and safe existing services when that is faster and more representative than rebuilding them.
- Isolate changes made in an existing frontend with a temporary branch or worktree, local-only route, feature flag, or an equivalent reversible boundary. The prototype brief records the code location and isolation method; the Project prototype folder retains the brief, durable evidence, and findings.
- When no suitable interface exists, start with an ASCII flow or wireframe and build an isolated interactive frontend only when interaction or visual evidence is still needed.
- Mocks and fixtures are appropriate when they answer the question without distorting the behaviour under review. Reuse an existing backend when it is safe and materially improves the evidence. Do not build new backend machinery merely to make a frontend prototype appear complete.
- New interface evidence may be skipped for explicitly non-user-facing work or when existing evidence already answers the question. Record the applicability decision and rationale in the Product Specification.

## Prototype authority

- Prototype findings are evidence. The reconciled Product and Technical Specifications remain the current intent.
- Prototype code remains experimental even when it is written inside the existing application. It must not become production code without an explicit Technical Specification decision and normal Build validation.

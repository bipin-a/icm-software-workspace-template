# Specification rules

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
- Prototype findings are evidence. The reconciled Product and Technical Specifications remain the current intent.
- Prototype code must not become production code without an explicit Technical Specification decision and normal Build validation.

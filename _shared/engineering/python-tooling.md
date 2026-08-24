# Python tooling

Defaults for Python-first application work.

- Prefer `uv` for Python project, environment, and dependency management.
- Prefer Ruff for linting and formatting.
- Keep executable dependency and tool configuration in `pyproject.toml`; do not duplicate versions or rule lists in Markdown.
- Prefer Pydantic for validating untrusted external input and serialized boundary contracts.
- Do not require every internal or domain object to inherit from Pydantic. Choose internal models according to domain meaning, invariants, lifecycle, and coupling.
- Record a Project-specific exception in its Technical Specification. Use an ADR when the exception or choice is consequential and expensive to reverse.

These are defaults, not substitutes for Project-specific architecture decisions.

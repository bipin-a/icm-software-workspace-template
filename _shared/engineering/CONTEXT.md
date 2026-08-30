---
type: engineering-reference-router
status: active
---

# Engineering reference catalog

One job: route a working contract to the smallest applicable engineering
profile. The profiles select headings from canonical rule files; they do not
restate those rules.

## Loading contract

- Load only the profile path and heading named by the current working contract.
- Within that profile, load only the named headings from each source file.
- Load a conditional heading only when its trigger is present.
- A Technical Specification or Delivery Assessment may name additional rule
  IDs for a demonstrated Project risk. Load those exact sections, not a full
  reference library.
- Keep repository inputs inside the workspace's configured context budget so
  current evidence and targeted code still fit.

## Profile shelves

| Need | Shelf |
|---|---|
| Bounded work without a Project, and Understand | [`profiles/direct-repository.md`](profiles/direct-repository.md) |
| Design and Build | [`profiles/design-build.md`](profiles/design-build.md) |
| Validate and Assess Readiness | [`profiles/validate-readiness.md`](profiles/validate-readiness.md) |
| Release and Learn | [`profiles/release-learn.md`](profiles/release-learn.md) |

Parent workflow routers select no engineering profile. An execution loads one
exact shelf heading, never this catalog plus every profile.

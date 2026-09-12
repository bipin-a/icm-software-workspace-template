# Local browser-test environment

One job: verify that a local browser test exercises the intended candidate.
Load this procedure only when a real browser is part of the selected proof.

## Before running the test

1. Identify the worktree or checkout, branch, and commit that own the candidate.
2. Determine whether the repository's browser-test runner will start its own
   servers or use explicitly supplied URLs.
3. Verify that every tested server and URL represents the intended candidate
   and environment.
4. Record the tested URLs and whether each server was started for the test or
   reused.

## Server provenance rules

- Reuse an existing local server only after verifying its checkout and
  candidate identity.
- Use repository-owned server and port selection when it exists. Do not stop an
  unrelated process merely to obtain a preferred port.
- When the caller supplies an external URL, the caller owns proof of its source,
  target environment, configuration, and data.
- When unrelated browser tests fail together, verify URLs, server provenance,
  and resource pressure before expanding the code investigation.
- A passing browser run against the wrong server is not evidence for the
  candidate.

## Human check

Material browser evidence names the candidate, tested URLs, environment and
data, and whether the servers were newly started or safely reused.

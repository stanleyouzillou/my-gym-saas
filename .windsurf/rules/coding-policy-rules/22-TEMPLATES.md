---
trigger: always_on
---

# Text Templates (no code)

## Use Case Spec (acceptance)

- **Title**: <Feature / Use Case>
- **Actors**: <roles>
- **Preconditions**: <state>
- **Scenarios** (Given‑When‑Then):
  - Happy path
  - Sad paths (validation, authn/z, provider failures)

## Port Contract (outbound dependency)

- **Purpose**: Why this port exists (business reason)
- **Operations**: Name, inputs/outputs, error variants
- **Non‑func**: latency budget, idempotency, retries
- **Test**: contract tests (in memory + adapter)

## Adapter Checklist

- Maps port contract faithfully
- Handles timeouts/retries/backoff
- Translates provider errors → domain failures
- Emits logs/metrics/traces

## Controller Checklist (delivery boundary)

- Validate & map input → DTO
- Resolve context (tenant/actor)
- Call use case
- Map Result → protocol response

## Test Plan (per feature)

- Unit coverage of domain + use cases
- Integration for adapters and composition
- E2E of critical journeys
- Negative tests for failure variants

---
trigger: always_on
---

# Testing Strategy (Pyramid)

- **Ratios**: Many **unit** tests; fewer **integration**; thin **E2E**. Keep the suite fast and trustworthy.
- **Patterns**: AAA (Arrange‑Act‑Assert), black‑box, descriptive names.
- **Tooling ideas**: Property‑based tests; mutation testing to assess test quality.
- **Scope**:
  - Unit: domain & application with in‑memory adapters.
  - Integration: adapter contracts (DB, queues, APIs) + composition root wiring.
  - E2E: a few critical journeys; production‑mirrored env; data builders/fixtures.
- **CI**: parallelism, flaky test quarantine, coverage thresholds (line/branch/function).

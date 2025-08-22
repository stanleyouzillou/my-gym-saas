---
trigger: always_on
---

# Contribution & PR Guide

- **Branching**: trunk‑based or short‑lived feature branches; small PRs (<400 LOC reviewable changes).
- **PR must answer**: What/Why? Affected feature? Risk? Rollback?
- **Checklist**:
  - [ ] Feature isolated to one module (or justified).
  - [ ] Ports used; no adapter imported in domain/app.
  - [ ] Acceptance + unit tests added/updated.
  - [ ] Observability added (log/trace/metrics) where relevant.
  - [ ] Docs/ADRs updated.
- **Reviews**: focus on behavior, boundaries, naming, invariants.

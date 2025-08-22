---
trigger: always_on
---

# Aggregates, Invariants & CQRS

- **Design**: Pick the root entity, list invariants, model internal members minimal to protect invariants.
- **Rules**: All writes go through the root; save/load the whole aggregate; keep aggregates small; wrap write actions in transactions.
- **Events**: Root raises domain events after state change; application handles side-effects via subscribers.
- **CQRS**: Split **commands** (write use cases) and **queries** (read use cases) when complexity warrants. Optimize read models for consumption, not for write invariants.

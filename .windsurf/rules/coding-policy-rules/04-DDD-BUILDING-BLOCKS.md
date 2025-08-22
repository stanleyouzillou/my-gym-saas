---
trigger: always_on
---

# DDD Building Blocks

- **Ubiquitous Language** across code/spec/docs.
- **Entities** (identity), **Value Objects** (immutable equality), **Aggregates** (consistency boundary with root), **Domain Services** (pure domain logic across entities), **Factories** (complex creation), **Repositories** (aggregate load/save), **Domain Events** (facts emitted by aggregates).
- **Repositories** exist as interfaces in domain; infra implements them behind ports.
- Prefer **immutability** and **pure functions** for business transformations; side-effects live in adapters.

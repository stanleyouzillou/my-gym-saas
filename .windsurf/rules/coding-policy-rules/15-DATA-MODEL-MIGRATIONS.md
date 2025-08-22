---
trigger: always_on
---

# Data Modeling & Migrations

- **Modeling** follows aggregates and read models (CQRS when warranted).
- **Migrations**: forward‑only, idempotent; expand‑migrate‑contract pattern for zero‑downtime.
- **Versioning**: event versioning and backward‑compatible contracts.
- **Integrity**: reference via aggregate roots; enforce invariants in domain first, database second.

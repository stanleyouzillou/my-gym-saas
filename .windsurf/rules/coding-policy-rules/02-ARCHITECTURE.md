---
trigger: always_on
---

# Architecture — Hexagonal / Clean / Onion

## Layers

- **Domain**: Entities, Value Objects, Aggregates, Domain Events. Pure, no framework/IO.
- **Application**: Use cases, transactions, orchestration. Depends on domain contracts only.
- **Infrastructure**: Adapters (DB, cache, queues, email, cloud). Implements ports.
- **Presentation**: Controllers, delivery protocols (HTTP/CLI/Queue/UI). No business logic.

## Rules

- **No inward violations**: Presentation → Application → Domain (allowed). Domain → Infrastructure (forbidden).
- **Bounded Contexts**: Partition complex domains; map relationships (partnership, ACL, conformist). Keep anti‑corruption layers at integration boundaries.
- **Composition roots**: One per bounded context. They assemble ports→adapters, configure cross‑cutting (logging, auth, tracing), and expose the app API.
- **Conway alignment**: Boundaries and ownership follow team topology.

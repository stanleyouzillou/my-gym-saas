---
trigger: always_on
---

# Ports, Adapters & Composition Roots

- Define **ports** (interfaces) in `application` for outbound deps (DB, cache, email, payment, storage).
- Implement **adapters** in `infrastructure/adapters/*` using shared **providers** (db clients, http clients, auth, logging).
- **Composition root** (`infrastructure/compose.*`) wires ports→adapters and injects cross‑cutting concerns.
- **Cross‑cutting** via middleware/interceptors at edges: authn/z, logging, tracing, transactions, idempotency, retries, circuit breakers.
- **No domain code** may import a concrete adapter or framework symbol.

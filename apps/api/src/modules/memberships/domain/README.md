# Memberships Domain (DDD)

- Entities
  - Member (identity: id)
- Value Objects
  - Email (immutable, normalized lowercase, basic validation)
- Aggregates
  - TBD — likely Member as aggregate root. Invariants to consider:
    - Email format must be valid
    - Unique email per tenant (enforced by repository/adapter)

Design notes:
- Keep domain free of framework and SDK imports (Nest, Prisma, Clerk, etc.).
- Repositories live as ports in `application/ports` and adapters in `infrastructure/`.
- Add unit tests for invariants as they are introduced.

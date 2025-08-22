---
trigger: manual
---

# Tech Constraints & Preferences (MVP-focused)

_Target stack:_ NestJS backend, Next.js frontend, Clerk for auth, Prisma ORM with Neon(Postgres), REST API, Stripe for payments.

## Key rules (must enforce)

- **Domain & Application layers are pure TypeScript**: no framework or provider imports (Nest/Prisma/Clerk/Stripe) inside `domain/` or `application/`. Enforce by import-lint checks. See Nest + hexagonal references.
- **Composition roots only**: only `infrastructure/compose.ts` (per context) can import concrete adapter implementations and provider SDKs.
- **Tenant context explicit**: all repository signatures include `tenantId`. No implicit tenant resolution in domain code. See multi-tenant guidance.
- **Prisma client central**: single Prisma client factory at `src/shared/infrastructure/providers/db/prismaClient.ts`. Avoid multiple Prisma instances. See Prisma + Neon guidance. citeturn0search1turn0search7
- **Stripe webhooks**: verify signatures on webhooks; use official libs. See Stripe docs. citeturn0search2turn0search19
- **Clerk token verification**: verify session tokens in Nest via Clerk backend utils or JWT verify flow; populate `req.principal`. citeturn0search6turn0search0

## Preferences & best practices

- Use **BFF pattern**: Next can act as BFF for web UX; complex orchestration lives on Nest. See Next.js BFF guidance.
- For MVP keep a **shared DB** (tenantId filter) and a modular monolith deployment; prefer Neon pooled connection strings for serverful Prisma.
- Use **atomic conditional updates** for booking capacity (or simple optimistic checks for MVP) — avoid complex distributed locking for now. (See guidance in EventStorm doc.)

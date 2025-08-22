---
name: clerk-user-sync
goal: Ensure Clerk users are reflected in domain (Tenant/Member) via webhook/first-login
---

# Summary
- Add feature to sync Clerk users into our DB.
- Create ports and use case in Memberships context; adapters via Prisma; Nest controller to receive Clerk events.

# Scope
- Ports: `IMemberRepository` (exists), `ITenantRepository` (new).
- Use case: `SyncUserUseCase` with idempotent upsert logic.
- Adapter: Prisma implementations for Tenant and Member.
- Composition: wire repos and use case in `memberships/infrastructure/compose.ts`.
- Presentation: Nest controller `POST /webhooks/clerk` to handle `user.created` / `user.updated`.

# Data model
- Tenant(name unique in practice — enforced by use case, not DB for now).
- Member(email unique, tenantId FK).

# Steps
1) Define `ITenantRepository`.
2) Implement PrismaTenantRepository.
3) Implement `SyncUserUseCase` (ensure tenant by name, upsert member for role=member only).
4) Expose in composition root.
5) Add controller to parse Clerk payload and invoke use case.
6) (Optional later) Add signature verification and support more roles (coach/staff).

# Verification
- Run Prisma generate, migrate OK.
- POST sample webhook payload → Tenant and/or Member rows exist.

# Rollback
- Purely additive code changes. Disable route if needed.

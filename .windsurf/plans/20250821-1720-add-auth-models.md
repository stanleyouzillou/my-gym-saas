---
name: add-auth-models
goal: Introduce/authenticate membership models for franchise auth flows
---

# Summary
- Intent: support franchise auth by persisting tenants and members.
- Current state: Prisma schema already defines Tenant, Member, Program, ClassSession, Booking, WaitlistEntry in `prisma/schema.prisma`.
- Migration impact: No schema change needed (no-op). We keep this plan for traceability.

# Schema diff
- None. Models already present:
  - Tenant(id, name, createdAt)
  - Member(id, tenantId, email unique, firstName, lastName, createdAt)

# Expand → Migrate → Contract
- Expand: N/A
- Migrate (data): optional seed to ensure at least one Tenant and a Member map to Clerk user. Not executed automatically.
- Contract: N/A

# Data migration (optional)
- Seed script could create Tenant("DefaultFranchise") and a Member record for test admin.

# Verification
- `npx prisma generate` succeeds.
- Integration tests for adapters pass.

# Rollback
- No schema changes applied; no rollback required.

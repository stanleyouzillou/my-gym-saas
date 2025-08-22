---
description:
auto_execution_mode: 1
---

input --name and --goal

Must-follow rules (short bullets)

One change per migration — keep migrations focused (name like add-auth-models, add-session-maxcapacity).

Plan file required — before creating files, write ./.windsurf/plans/<ts>-create-migration.md summarizing intent + schema diff.

Expand → migrate → contract pattern for risky changes:

Expand: Add nullable columns / new tables / defaults.

Migrate: Backfill or data migration step (separate script) if needed.

Contract: Make columns non-null or remove legacy columns in a later migration.

Non-destructive first — prefer additive migrations; destructive drops must be scheduled and justified in ADR and tested.

Tenant-aware schema — models that require tenancy must include tenantId column/index. Repos and seed scripts must use tenantId.

Name + timestamp — migration directory names must follow: <timestamp>-<name>. Use Prisma CLI defaults.

Include data migrations separately — any JS/TS seed/backfill must live in prisma/migrations/<migration>/data/ or prisma/seeds/ and be idempotent. Document intent in the plan file.

Local dev flow — run npx prisma migrate dev --name <name> to create migration + npx prisma generate. Commit generated files.

CI / deploy flow — only run npx prisma migrate deploy in CI or deploy pipeline. Do not run migrate dev in CI.

Verify in tests — add/adjust integration tests to cover new schema behavior (contract tests for adapters). CI must run them before merge.

Compose & adapters — if schema change requires adapter changes, update adapter stubs in src/modules/\*\*/infrastructure/adapters/... and composition roots; declare ports first if needed.

ADR for breaking changes — destructive or semantic-breaking changes must have an ADR and be referenced in the migration plan.

Rollback notes — include a short rollback/undo section in the plan; for destructive ops, provide a restore path (backup + restore procedure).

Secrets & DB access — migrations run in CI using DATABASE_URL from secrets; ensure the migration runner has appropriate permissions (migrate, read/write) but not superuser unless required.

Acceptance checks (agent must pass)

Plan file exists and lists schema diff + data migration steps.

Generated migration files committed under /prisma/migrations/.

npx prisma generate ran successfully (client updated).

Integration tests that touch changed models pass locally and in CI.

prisma migrate deploy successful in a staging run (or dry-run) before production deploy.

.env.example updated if new env keys needed for data migrations.

Short best-practice reminders

Prefer small, additive migrations.

Keep tenantId explicit and indexed.

Never apply destructive changes directly in production without ADR and backup.

Run migrations in CI (deploy) not ad-hoc on prod hosts.

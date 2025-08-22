# Integration Points & Infra Hooks (concrete)

List of adapters, where to place them, and env vars.

## Authentication — Clerk
- Adapter: `src/shared/infrastructure/providers/auth/clerk/`
- Nest Guard: `src/shared/presentation/guards/clerk.guard.ts`
- Env: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_JWT_KEY`.
- Docs: verify tokens / authenticate requests. citeturn0search6turn0search0

## Database — Prisma + Neon
- Prisma schema: `/prisma/schema.prisma`
- Prisma client: `src/shared/infrastructure/providers/db/prismaClient.ts`
- Feature repos: `src/modules/*/infrastructure/adapters/db/prisma/*Repo.ts`
- Env: `DATABASE_URL` (use pooled Neon endpoint `-pooler` if available). See Prisma+Neon guides. citeturn0search1turn0search7

## Payments — Stripe
- Port interface: `src/modules/memberships/application/ports/IPaymentGateway.ts`
- Adapter: `src/shared/infrastructure/adapters/payment/stripe/StripePaymentAdapter.ts`
- Webhook controller: `src/shared/presentation/controllers/webhooks/stripe.controller.ts` (verify signature). Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. citeturn0search2turn0search19

## Notifications — SendGrid (email)
- Port: `src/shared/application/ports/INotificationService.ts`
- Adapter: `src/shared/infrastructure/adapters/notification/sendgridAdapter.ts`
- Env: `SENDGRID_API_KEY`, `NOTIFICATION_FROM_EMAIL`

## Background jobs (optional MVP)
- Use simple Nest cron jobs or in-process worker; queue adapter (BullMQ + Redis) added later at `src/shared/infrastructure/adapters/queue/`. Env: `REDIS_URL`

## Observability & error tracking
- Logger: `src/shared/infrastructure/providers/logging/winston.ts`
- Optional Sentry hook in `main.ts`. Env: `SENTRY_DSN`

## CI & deployment hooks
- CI: run `prisma generate`, lint, typecheck, unit tests, compose import-lint check.
- On deploy: `prisma migrate deploy` and register Stripe webhook endpoint.

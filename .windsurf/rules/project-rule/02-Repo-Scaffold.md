---
trigger: manual
---

# Repo scaffold — Next + Nest monorepo (imperative, copy-paste)

Use these exact, ordered steps to bootstrap the repository. Commands are **imperative** and intended to be copy-pasted into a terminal on the machine that will run the agent. Install CLIs first so scaffolding uses current versions.

---

## 0) Preflight checks (one-time)

```bash
# check node (LTS recommended: 18.x or 20.x)
node -v
npm -v
```

If you manage Node versions, use `nvm` to install an LTS and activate it.

---

## 1) Install CLIs (install first so scaffolding uses latest tools)

```bash
# Nest CLI (global)
npm install -g @nestjs/cli@latest

# Optional global conveniences
npm install -g typescript@latest
npm install -g create-next-app@latest
```

References:

- Nest CLI docs: [https://docs.nestjs.com/cli/overview](https://docs.nestjs.com/cli/overview)
- create-next-app (Next.js scaffolding): [https://nextjs.org/docs/api-reference/create-next-app](https://nextjs.org/docs/api-reference/create-next-app)

---

## 2) Create repo root & init git

```bash
mkdir gym-studio && cd gym-studio
git init
git checkout -b feat/walking-skeleton
```

---

## 3) Install workspace manager & init workspace (npm workspaces example)

```bash
# initialize root package.json
npm init -y

# edit package.json to contain:
# {
#   "name": "gym-studio",
#   "private": true,
#   "workspaces": ["apps/*","packages/*"]
# }
# (You can set this programmatically or use an editor)
```

Notes: You may use pnpm or Yarn workspaces if preferred. Workspaces let web + api + packages share types.

---

## 4) Scaffold Next.js frontend (app router)

```bash
# from repo root
npx create-next-app@latest apps/web --typescript --eslint --app
# OR (if global installed)
create-next-app apps/web --typescript --eslint --app
```

After scaffolding:

```bash
cd apps/web
# install Clerk client lib
npm install @clerk/nextjs
# optionally install Tailwind
npm install -D tailwindcss postcss autoprefixer
cd ../..
```

References:

- Next.js docs (app router): [https://nextjs.org/docs](https://nextjs.org/docs)
- Clerk Next quickstart: [https://docs.clerk.dev/quickstarts/backend/nextjs](https://docs.clerk.dev/quickstarts/backend/nextjs)

---

## 5) Scaffold NestJS backend (API)

```bash
# from repo root
nest new apps/api
# choose npm when prompted (or yarn/pnpm per your preference)
```

After scaffolding, add libraries:

```bash
cd apps/api
npm install @prisma/client
npm install --save-dev prisma
npm install class-validator class-transformer
npm install stripe @sendgrid/mail @clerk/clerk-sdk-node helmet
cd ../..
```

References:

- NestJS docs: [https://docs.nestjs.com](https://docs.nestjs.com)
- Prisma docs: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- Stripe webhooks & payments: [https://stripe.com/docs/webhooks](https://stripe.com/docs/webhooks) , [https://stripe.com/docs/payments](https://stripe.com/docs/payments)
- SendGrid Node quickstart: [https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)
- Clerk backend SDK: [https://docs.clerk.dev](https://docs.clerk.dev)

---

## 6) Create shared packages

```bash
mkdir -p packages/{types,ui,testing}
cd packages/types
npm init -y
# create a minimal tsconfig.json and src/index.ts that exports DTO types
cd ../..
```

Purpose: `packages/types` holds shared DTOs (SessionDTO, BookingDTO) used by both Next and Nest.

---

## 7) Add Prisma schema & generate client (Neon-ready)

Create `prisma/schema.prisma` at repo root with minimal models:

- Tenant, Member, Program, ClassSession, Booking, WaitlistEntry

Then:

```bash
# from repo root
cd apps/api
npx prisma init --schema=../../prisma/schema.prisma
# Add real schema content to prisma/schema.prisma (see templates)
npx prisma generate
cd ../..
```

Neon note: use Neon pooled connection string or Prisma Data Proxy for serverless pooling.
References:

- Prisma + general docs: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- Neon docs + connection pooling: [https://neon.tech/docs](https://neon.tech/docs)

---

## 8) Wire Clerk authentication (frontend + backend)

**Frontend (Next):**

- Add `ClerkProvider` per Clerk docs; put provider in `apps/web/app/providers/ClerkProvider.tsx`.
- Configure `.env.local` with `CLERK_PUBLISHABLE_KEY`.

**Backend (Nest):**

- Create a Nest Guard at `apps/api/src/shared/presentation/guards/clerk.guard.ts` that verifies Clerk session tokens (use `@clerk/clerk-sdk-node` or JWT verification).
- Middleware should populate `req.principal = { userId, email, claims }`.

References:

- Clerk docs: [https://docs.clerk.dev](https://docs.clerk.dev)

---

## 9) Add Stripe webhook & payment wiring

**Install** (done above). Create webhook controller:

- `apps/api/src/shared/presentation/controllers/webhooks/stripe.controller.ts`
- Use `stripe.webhooks.constructEvent()` to verify signature with `STRIPE_WEBHOOK_SECRET`.

Environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

References:

- Stripe webhook verification: [https://stripe.com/docs/webhooks/signatures](https://stripe.com/docs/webhooks/signatures)

---

## 10) Add SendGrid adapter (email notifications)

- Create adapter: `apps/api/src/shared/infrastructure/adapters/notification/sendgridAdapter.ts`.
- Env:

  - `SENDGRID_API_KEY`
  - `NOTIFICATION_FROM_EMAIL`
    Reference: [https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)

---

## 11) Create Prisma client factory (singleton)

Create `apps/api/src/shared/infrastructure/providers/db/prismaClient.ts` that exports a single PrismaClient instance (handle NODE_ENV to prevent multiple instances in dev).

Reference:

- Prisma client best practices: [https://www.prisma.io/docs/guides/performance-and-optimization/connection-management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

## 12) Create composition roots (one per bounded context)

For each context (e.g., `scheduling`, `memberships`), create:

```
src/modules/<context>/infrastructure/compose.ts
```

This file exports `get<Context>Deps()` and **is the only file allowed to import provider SDKs** (Stripe, Prisma, SendGrid, Clerk SDK).

Why: prevents framework/provider bleed into domain/application. See Hexagonal composition guidance: [https://alistair.cockburn.us/hexagonal-architecture/](https://alistair.cockburn.us/hexagonal-architecture/)

---

## 13) Create Walking Skeleton (smoke vertical slice)

Create minimal end-to-end slice:

- `apps/web/app/page.tsx` — small page that calls BFF endpoint.
- `apps/api/src/main.ts` — bootstrap Nest app with health endpoint `/health` and `GET /api/sessions` returning in-memory sessions.
- `src/modules/scheduling/application/use_cases/listSessions.ts` — use-case reading from `inMemory` repo.
- `src/modules/scheduling/infrastructure/adapters/inMemory/sessionRepo.ts` — simple in-memory repo with sample session.
- `src/modules/scheduling/infrastructure/compose.ts` — `getSchedulingDeps()` returning in-memory repo.

Acceptance smoke:

- `GET /api/sessions` → 200 + JSON list

---

## 14) Create `.env.example` (essential keys)

Add a `.env.example` at repo root with:

```
# Clerk
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Neon/Postgres)
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# SendGrid
SENDGRID_API_KEY=
NOTIFICATION_FROM_EMAIL=

# App
NODE_ENV=development
APP_HOST=localhost
APP_PORT=3000

# Optional
REDIS_URL=
SENTRY_DSN=
```

---

## 15) CI basics (GitHub Actions) — minimal jobs

Create `.github/workflows/ci.yml` with these steps:

1. checkout
2. setup-node
3. `npm ci`
4. `npx prisma generate`
5. `npm run lint`
6. `npm run test:unit`
7. `npm run test:acceptance` (smoke)

Add an import-lint check to enforce domain/application not importing infra.

Reference for CI patterns: [https://docs.github.com/actions](https://docs.github.com/actions)

---

## 16) Dev run commands (after `npm install`)

```bash
# install in workspace
npm install

# run Nest API (dev)
cd apps/api
npm run start:dev

# run Next frontend (dev)
cd apps/web
npm run dev
```

---

## 17) Recommended file structure (final)

```
/ (repo root)
├── apps/
│   ├── web/                # Next.js app (app router)
│   └── api/                # NestJS app
├── packages/
│   ├── types/
│   ├── ui/
│   └── testing/
├── prisma/
│   └── schema.prisma
├── src/                    # optional if sharing code at root
├── features/               # .feature files
├── docs/
├── .windsurf/
├── .env.example
├── package.json
└── README.md
```

---

## 18) Practical tips & gotchas (imperative)

- **Install CLIs first** (we repeated this for a reason) to avoid stale scaffolding.
- **Prisma + Neon:** prefer pooled connection strings; test `prisma generate` early. Neon docs: [https://neon.tech/docs](https://neon.tech/docs)
- **Stripe webhooks:** use Stripe CLI locally to forward webhooks during dev: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
- **Clerk:** use Clerk dev keys in local env; follow Clerk Next quickstart: [https://docs.clerk.dev](https://docs.clerk.dev)
- **Keep domain pure:** do not import `@nestjs/*`, Prisma client, Stripe, Clerk SDK, or SendGrid into `domain/` or `application/` folders. Enforce with an import-linter.

---

## 19) Helpful links (copyable)

- NestJS docs & CLI: [https://docs.nestjs.com/cli/overview](https://docs.nestjs.com/cli/overview)
- Next.js docs / create-next-app: [https://nextjs.org/docs/api-reference/create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
- Prisma docs: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- Neon docs: [https://neon.tech/docs](https://neon.tech/docs)
- Stripe docs (webhooks & payments): [https://stripe.com/docs/webhooks](https://stripe.com/docs/webhooks) , [https://stripe.com/docs/payments](https://stripe.com/docs/payments)
- Clerk docs: [https://docs.clerk.dev](https://docs.clerk.dev)
- SendGrid Node quickstart: [https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)
- Hexagonal architecture overview: [https://alistair.cockburn.us/hexagonal-architecture/](https://alistair.cockburn.us/hexagonal-architecture/)

---

## 20) Next steps (agent tasks you can run immediately)

1. Run the Preflight + Install CLIs commands above.
2. Run the scaffolding commands for Next and Nest.
3. Create `packages/types` and add minimal DTOs.
4. Add `prisma/schema.prisma` then run `npx prisma generate`.
5. Add Clerk, Stripe, SendGrid env keys to `.env.example`.
6. Implement the walking skeleton and run the smoke acceptance test (`GET /api/sessions`).

---

If you want, I can now:

- generate the **exact** `prisma/schema.prisma` content and the **minimal stub files** (compose + controllers + inMemory adapters) so the walking skeleton is runnable, or
- create a ready GitHub Actions CI file that runs lint/typecheck/prisma/generate and the acceptance smoke test.

Which should I produce next?

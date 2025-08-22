---
description: Auto-run MVP plan→apply loop in dev (BDD until green + dev servers), with audit saved to ./.windsurf/plans
---

This workflow continuously runs safe "plan→apply" steps in dev for the MVP slice:
- Executes only the MVP acceptance features.
- Saves a Cucumber JSON audit report to `./.windsurf/plans/` on each run.
- Optionally starts API and Web dev servers (Nest + Next) to bring the UI live.

Prereqs:
- Env in `.env` with `USE_DB_PRISMA` off (in-memory repos) for fastest loop.
- Prisma schema migrated and seeds optional.

1) Install deps (once per fresh clone)
   pnpm i

// turbo
2) Run MVP BDD (with audit report)
   pnpm --filter ./apps/api run test:bdd:mvp:report

- Output: `./.windsurf/plans/bdd-mvp-report.json`
- If failing, fix steps/impl and re-run this step until green.

// turbo
3) Start API dev server (Nest, in-memory)
   pnpm --filter ./apps/api run start:dev:mem

Notes:
- Runs on port 3001 by default (via `PORT=3001`).
- Watches for changes.

// turbo
4) Start Web dev server (Next.js)
   pnpm --filter ./apps/web run dev

Notes:
- Open the browser at the printed URL (usually http://localhost:3000).
- Wire the UI to the API base URL (http://localhost:3001) for MVP flows.

5) Repeat plan→apply loop
- Keep this workflow handy; re-run step 2 to validate acceptance after each change.
- The audit JSON is overwritten each run; archive as needed.

Troubleshooting:
- If ports are busy, stop existing servers or change the ports.
- To scope Cucumber to a single feature during debugging, run from `apps/api`:
  `pnpm run test:bdd -- ../../features/session-register.feature`

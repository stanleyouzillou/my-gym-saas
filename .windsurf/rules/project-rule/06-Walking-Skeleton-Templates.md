# Walking Skeleton Templates (minimal E2E slice)

Goal: one vertical slice that touches Next UI -> Nest controller -> use-case -> in-memory repo -> returns data.

## Minimal files to create
- `apps/web/pages/index.tsx` — calls `/api/ping` and shows "OK".
- `apps/api/src/main.ts` — Nest bootstrap, health controller, and `SessionsController` with `GET /api/sessions` returning sample data from in-memory adapter.
- `packages/testing/in-memory/sessionRepo.ts` — simple in-memory session store with sample session.
- `src/modules/scheduling/application/use_cases/listSessions.ts` — use-case that reads sessions from repo.
- Compose: `src/modules/scheduling/infrastructure/compose.ts` returning `getSchedulingDeps()` with in-memory repo.

## Acceptance test (smoke)
- `tests/acceptance/smoke.feature`:
  - Given the system is running
  - When I request GET /api/sessions
  - Then I receive 200 and a list of sessions

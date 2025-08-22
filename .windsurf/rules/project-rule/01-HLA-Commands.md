# High-Level API Workflows (Deterministic Commands)

Each command is idempotent, supports `--plan` (dry-run) and `--apply` modes, and writes a short audit log in `./.windsurf/plans/` for review.

## Commands (HLA)
- `init-app` — bootstrap repo skeleton (Next + Nest monorepo), base CI, env.example. Inputs: `name`, `license`.
- `create-context` — scaffold bounded context (modules/<Context> with domain/app/infra/presentation). Inputs: `contextName`, `owner`.
- `new-feature` — create feature spec + acceptance `.feature` skeleton and test stub. Inputs: `context`, `featureName`, `actors`, `goal`.
- `ship-slice` — implement minimal vertical slice using in-memory adapters; makes acceptance test pass. Inputs: `context`, `feature`.
- `bind-delivery` — create controller + route + DTO mappers for REST. Inputs: `context`, `feature`, `route`.
- `add-port` — declare an outbound port interface in application layer. Inputs: `context`, `feature`, `portName`, `ops`.
- `add-adapter` — add concrete adapter behind a port (e.g., stripe/sendgrid/prisma). Inputs: `context`, `feature`, `portName`, `provider`.
- `compose` — create/modify `compose.ts` for the context to wire ports→adapters. Inputs: `context`, `feature`, `providers`.
- `enable-providers` — swap in production adapters and generate contract tests. Inputs: `context`, `feature`, `providerMatrix`.
- `test` — run tests by scope (`unit|acceptance|integration|e2e`). Inputs: `scope`.
- `refactor` — behavior-preserving refactor within a context/feature (moves/renames and updates imports). Inputs: `target`, `goal`.
- `quality-gates` — run lint, import-lint, dep-graph checks, and coverage thresholds.
- `release` — tag release, change log snippet generation.

## Notes for the agent
- All file writes must be deterministic and idempotent.
- Prefer minimal, compile-safe stubs rather than large blocks of code the user must review.
- For each change, produce a one-paragraph "What I changed" summary and the plan file in `./.windsurf/plans/`.

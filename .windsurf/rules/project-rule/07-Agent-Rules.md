# Agent Rules (for Windsurf Coding Agent)

These are the enforcement rules and workflow behaviours the agent must follow.

## Core behaviours
- **Idempotence:** every command must be re-runnable; before writing check for existing files and produce a plan file.
- **Single responsibility**: create/modify files only within the specified context/feature unless explicitly asked.
- **Composition roots**: only `compose.ts` files import provider SDKs (Stripe, Clerk, Prisma).
- **No domain leakage**: domain/application folders must not import `infrastructure` or provider packages. Reject PRs that violate.
- **Plan transparency**: produce `./.windsurf/plans/<timestamp>-<cmd>.md` describing diffs.

## CI enforcement (automated checks)
- **Import-lint**: fail if forbidden imports found (domain → infra).
- **Dep-graph**: run madge to detect cycles.
- **Test gate**: acceptance tests for the changed feature must pass for merge.
- **Naming conventions**: kebab-case for files, PascalCase for types, `get<Context>Deps()` naming for compose.

## PR checklist the agent must fill
- Does this change add ports for outbound dependencies?
- Does it add adapters under `infrastructure/adapters/` and register them only in `compose.ts`?
- Are new env vars added to `.env.example`?
- Are Gherkin acceptance tests added/updated?
- Is a plan file attached to the PR?

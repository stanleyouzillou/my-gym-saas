---
trigger: manual
---

# Enterprise Coding Agent — Starter Kit (Framework-Agnostic)

This pack gives a **complete, enforceable operating system** for a coding agent to create and maintain **enterprise‑grade** software across stacks. It unifies Domain‑Driven Design, Hexagonal/Clean Architecture, Double‑Loop TDD, robust testing, and CI quality gates.

**How to use**

1. Start with `01-PRINCIPLES.md` and `02-ARCHITECTURE.md`.
2. Bootstrap a **Walking Skeleton** before business code (`06-PLANNING-WORKFLOW.md`).
3. Implement features as **use cases** with **ports/adapters** (`04`, `05`, `10`).
4. Keep tests green with **double loop TDD** (`07`) and follow the **test pyramid** (`08`).
5. Ship with **quality gates** (`17`) and document decisions (`19`).

**Files**

- 01-PRINCIPLES.md — Core values, decision criteria.
- 02-ARCHITECTURE.md — Dependency Rule, hexagonal layers, bounded contexts.
- 03-PROJECT-STRUCTURE.md — Feature-first layout, modular monolith.
- 04-DDD-BUILDING-BLOCKS.md — Entities, VOs, Aggregates, Repos, Services, Events.
- 05-AGGREGATES-CQRS.md — Invariants, transactions, command vs query model.
- 06-PLANNING-WORKFLOW.md — Event Storming, Walking Skeleton, iteration zero.
- 07-TDD-DOUBLE-LOOP.md — Acceptance (outer) + unit (inner) cycle.
- 08-TESTING-STRATEGY.md — Test pyramid, AAA, property & mutation testing.
- 09-ERROR-HANDLING.md — Errors vs exceptions, Result/Either pattern.
- 10-PORTS-ADAPTERS-PROVIDERS.md — Contracts, composition roots, cross-cutting.
- 11-MULTI-TENANCY.md — Tenant context, isolation, test strategy.
- 12-CONFIG-SECRETS-FEATURE-FLAGS.md — Twelve‑factor config, secrets, flags.
- 13-OBSERVABILITY-SLO.md — Logs, traces, metrics, SLO/SLA/SLI.
- 14-SECURITY-COMPLIANCE.md — Threat modeling, authz/authn, data protection.
- 15-DATA-MODEL-MIGRATIONS.md — Modeling, migrations, versioning.
- 16-PERFORMANCE-CACHING.md — Perf budgets, caching layers, backpressure.
- 17-CI-CD-QUALITY-GATES.md — Lint/import rules, dep graphs, coverage, DORA.
- 18-REFACTORING-PLAYBOOK.md — Safe refactors, strangler patterns, module extraction.
- 19-DOCS-ADRS-LANGUAGE.md — ADRs, ubiquitous language, repo docs.
- 20-CONTRIBUTION-PR-GUIDE.md — Branching, PR checklist, code review rules.
- 21-CHECKLISTS.md — DoR/DoD, readiness, operability, production review.
- 22-TEMPLATES.md — Text-only templates for use case, port, adapter, controller, test plan.

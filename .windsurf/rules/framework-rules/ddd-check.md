---
trigger: manual
---

Below is a **declarative, framework-agnostic DDD check** you can drop into your agent’s rule set. Keep it short, broad, and actionable — it declares _what_ to check, _why_, and _what to do if violated_. Useful as a pre-merge CI check or an automated agent policy.

All key claims are backed by canonical DDD / ports-and-adapters references. ([martinfowler.com][1], [Alistair Cockburn][2], [Archi Lab][3], [Microsoft Learn][4], [AWS Documentation][5])

---

# DDD Check — Declarative Rule (framework-agnostic)

**Purpose:** ensure the codebase contains a correct domain model (Entities, Value Objects, Aggregates), clear ports & adapters, and that domain logic is isolated and testable.

---

## Pass/Fail summary (one line)

Fail if any _critical_ rule below is violated; otherwise pass. Critical rules must block merges.

---

## Rules (declarative checks)

### 1. Domain existence (critical)

- **Check:** `domain/` exists for each bounded context and contains at least one `entities/` file and one `aggregate` or `aggregates` artifact (or deliberate TODO stub).
- **Why:** Domain objects are the heart of DDD — code must represent business concepts, not just CRUD. ([martinfowler.com][1])
- **Remedy:** If missing, auto-generate `domain/entities/TODOEntity.ts` and `domain/README.md` with a short modeling prompt.

### 2. Value Objects present & immutable (critical)

- **Check:** presence of `value-objects/` with at least one VO or a VO stub; VOs are implemented immutably (no setters / mutate methods).
- **Why:** VOs model attributes and should be compared by value and be immutable. ([martinfowler.com][1], [Microsoft Learn][4])
- **Remedy:** If mutable primitives are used where a VO is appropriate, suggest/create VO wrapper and replace call sites gradually.

### 3. Aggregate boundaries & invariants (critical)

- **Check:** aggregate root classes exist; invariants are enforced inside aggregate methods (not in controllers or repositories); aggregates reference other aggregates by id only.
- **Why:** Aggregates define transactional/consistency boundaries; keep them small and authoritative for invariants. ([Archi Lab][3])
- **Remedy:** If invariants live in controllers or adapters, propose moving logic into aggregate methods and create failing unit tests before refactor.

### 4. Ports & Adapters (critical)

- **Check:** outbound dependencies are declared as interfaces/ports in `application/ports` (or `domain/ports`) and concrete adapters live only under `infrastructure/adapters/*`. No direct SDK imports inside domain/app.
- **Why:** Ports-and-adapters (hexagonal) separate business logic from infrastructure and enable testability and swapability. ([Alistair Cockburn][2], [AWS Documentation][5])
- **Remedy:** If infra imports found in domain/app, produce a plan to create a port, move imports into an adapter, and register adapter with composition root.

### 5. Composition root / wiring (must)

- **Check:** a single composition point per context (e.g., `compose.ts` or module) wires ports → adapters. Only composition root may import SDKs/config.
- **Remedy:** If SDK appears elsewhere, move provider instantiation to composition module and inject adapter via port.

### 6. Presentation thinness (must)

- **Check:** controllers/handlers only: DTO validation, auth guard checks, mapping to use-case inputs, and calling use-cases. No domain logic (no business rules/consistency code).
- **Remedy:** Auto-detect business-like logic in controllers and flag with examples; create TODOs to move logic into use-cases / aggregates.

### 7. Tests & acceptance (must)

- **Check:** for each feature: a Gherkin acceptance test or equivalent acceptance spec exists, and unit tests cover aggregate invariants. In-memory adapters must exist for acceptance harness.
- **Remedy:** Generate acceptance `.feature` and minimal in-memory adapter if missing.

### 8. Naming & structure conventions (must)

- **Check:** contexts follow `src/modules/<Context>/{domain,application,infrastructure,presentation}` or established project variant. Entities live in `domain/entities`, VOs in `domain/value-objects`, ports in `application/ports`.
- **Remedy:** If layout differs, generate a mapping report and optional reorganization plan.

### 9. Persistence & identity rules (advisory)

- **Check (advisory):** persistence models map to aggregates but do not leak DB concerns into domain objects (no ORM decorators in domain layer).
- **Why:** Domain should be persistence-agnostic; adapters map domain ↔ persistence representation.
- **Remedy:** If ORM annotations appear in domain, suggest moving mapping into repository/adapter.

### 10. Aggregate sizing & references (advisory)

- **Check (advisory):** aggregates are reasonably small; references to other aggregates are by id (not object graph). Flag oversized aggregates for review. ([Archi Lab][3])

---

## Automated checks to run (tooling hints)

- **Import scanner / lint rules**: `no-restricted-imports` to forbid infra SDKs inside `domain/` and `application/`.
- **Dependency graph**: run `madge` to detect cycles and inward infra → domain imports.
- **Static search**: grep for SDK strings (`from 'stripe'`, `from '@prisma/client'`, `from '@clerk'`) and ensure file paths allowed.
- **Test presence**: ensure `features/*.feature` or `tests/acceptance/*` contains entry for new features.
- **VO immutability detection**: simple heuristic (mutable setters or public fields) to flag likely mutable VOs.

---

## Minimal acceptance criteria (what passing looks like)

- Domain dir exists per context with at least one entity & one VO or stub.
- Ports declared for outbound dependencies; no infra SDK import in domain/app.
- At least one aggregate exhibits business invariant unit test (fail before fix, pass after).
- Composition root(s) present and only they instantiate SDKs.
- Gherkin acceptance file exists for the feature and has a matching step-binding skeleton.

---

## Remediation actions (what agent may do, idempotent)

- Create TODO stubs for missing domain artifacts (safe, non-destructive).
- Move provider imports out of domain/app into `infrastructure/compose` and create a port interface if missing.
- Generate VO wrapper classes and add migration TODOs / codemods for replacing primitives.
- Emit a human-readable report (`./.windsurf/reports/ddd-check-<ts>.md`) describing violations, fixes applied, and manual steps required.

---

## Short modeling heuristics (for human review)

- **Entity:** has identity, evolves over time (Member, Program).
- **Value Object:** immutable, compared by value (Money, DateRange). ([martinfowler.com][1], [Microsoft Learn][4])
- **Aggregate:** small consistency boundary that enforces invariants; reference other aggregates by id. Keep aggregates small. ([Archi Lab][3])
- **Ports/Adapters:** interfaces for external concerns; adapters implement ports and live in infra. ([Alistair Cockburn][2])

---

## Canonical references (for further reading)

- Value Object (Martin Fowler). ([martinfowler.com][1])
- Hexagonal / Ports & Adapters (Alistair Cockburn). ([Alistair Cockburn][2])
- Aggregate design rules (Vaughn Vernon). ([Archi Lab][3])
- Value object implementation guidance (Microsoft / DDD patterns). ([Microsoft Learn][4])
- Hexagonal architecture overview (AWS Prescriptive Guidance). ([AWS Documentation][5])

---

If you want, I can:

- produce: (A) an ESLint `no-restricted-imports` snippet + madge job for CI, **and** (B) a small repo-scanner script that produces the `./.windsurf/reports/ddd-check-<ts>.md` automatically.
  Pick A, B, or both and I’ll generate them next.

[1]: https://martinfowler.com/bliki/ValueObject.html?utm_source=chatgpt.com "Value Object"
[2]: https://alistair.cockburn.us/hexagonal-architecture?utm_source=chatgpt.com "hexagonal-architecture - Alistair Cockburn"
[3]: https://www.archi-lab.io/infopages/ddd/aggregate-design-rules-vernon.html?utm_source=chatgpt.com "Aggregate Design Rules according to Vaughn Vernon's “Red ..."
[4]: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/implement-value-objects?utm_source=chatgpt.com "Implementing value objects - .NET"
[5]: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/hexagonal-architecture.html?utm_source=chatgpt.com "Hexagonal architecture pattern - AWS Prescriptive Guidance"

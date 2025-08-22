# BDD Acceptance Harness (Recommended stack)

## Tools
- **Unit + runner:** Jest (Vitest optional).  
- **Gherkin / BDD:** `cucumber-js` or `jest-cucumber` for Node-based step bindings. See Gherkin reference. citeturn0search9turn0search4
- **HTTP testing:** `supertest` for controller-level tests (Nest) or `next-test` helpers for Next.  
- **Test doubles:** in-memory adapters in `packages/testing/in-memory/*` to make acceptance tests fast & reliable.

## Pattern (Double-loop TDD)
1. Outer (acceptance) — Gherkin scenario runs against use-case-level harness (controllers or lightweight test harness that calls use-cases with in-memory adapters).  
2. Inner (unit) — implement domain objects and unit tests until acceptance passes.  

## Directory for tests
```
/tests
  /acceptance  # .feature files + step bindings
  /integration # adapter contract tests
  /unit
```

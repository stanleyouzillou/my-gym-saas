---
trigger: always_on
---

# Principles & Decision Heuristics

- **Value first**: Optimize for maintainability, evolvability, reliability.
- **Architecture serves requirements**: Choose patterns based on functional + non-functional needs (testability, performance, security, compliance).
- **Dependency Rule**: Inner layers never depend on outer; depend on **contracts**, not implementations.
- **Domain-first**: Express the ubiquitous language in code; isolate business logic from frameworks.
- **Modular monolith first**: Start in-process with clear bounded contexts; split when team topology and operational signals demand.
- **Small, vertical slices**: Ship thin, end-to-end increments; prefer “walking skeleton” → iterative features.
- **Double-Loop TDD**: Acceptance (outer) + Unit (inner) to keep a single level of abstraction per layer.
- **Ports & Adapters**: All IO is behind interfaces; adapters chosen in composition roots.
- **One happy path, many sad paths**: Make failure modes explicit (typed), not implicit (nulls).
- **Continuous enforcement**: Architecture validated in CI with import rules, dep graphs, and quality gates.

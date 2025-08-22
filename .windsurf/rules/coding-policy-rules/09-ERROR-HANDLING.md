---
trigger: always_on
---

# Error & Exception Handling

- **Exceptions**: for programmer bugs or truly exceptional situations.
- **Errors (operational)**: expected failure modes (e.g., validation, declined payment) → represent as **Result/Either** return types.
- **Rules**:
  - Domain/application return `Result<Success, Failure>` variants; no `null`/`undefined` for control flow.
  - Map third‑party exceptions to domain failures at adapter boundaries.
  - Present a standardized error envelope at the delivery layer.

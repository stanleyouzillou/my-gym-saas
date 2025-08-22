---
trigger: always_on
---

# Double-Loop TDD

- **Outer loop**: Acceptance test per use case (Given‑When‑Then). Validates behavior from boundary.
- **Inner loop**: Red‑Green‑Refactor unit tests for objects created to satisfy outer loop.
- Prefer outcome‑based assertions over interaction obsession; mock external collaborators only at boundaries.
- **Design happens in Refactor**: improve names, extract VOs, enforce invariants, remove duplication (Rule of Three).

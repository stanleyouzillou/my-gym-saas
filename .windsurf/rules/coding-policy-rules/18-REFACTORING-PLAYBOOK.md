---
trigger: always_on
---

# Refactoring Playbook

- **Rule of Three** before abstraction; keep refactors behavior‑preserving under green tests.
- **Strangler Fig** for legacy modules: build new around old, swap adapters.
- **Module extraction**: define contracts, move code behind ports, then relocate.
- **Rename safely**: update ubiquitous language consistently across code/docs/tests.

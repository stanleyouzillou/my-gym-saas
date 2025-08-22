---
trigger: always_on
---

# CI/CD & Quality Gates

- **Pipelines**: lint → typecheck → unit → integration (with containers) → e2e (smoke) → deploy.
- **Import rules**: fail on domain→infra or presentation→infra imports; check with ESLint & dep graph tool.
- **Coverage**: minimum thresholds per layer; mutation score gates for critical modules.
- **DORA**: track lead time, deployment frequency, MTTR, change fail rate.
- **Security**: SAST/DAST, dependency audit, secret scanning before merge.

---
trigger: always_on
---

# Multi‑Tenancy Guidelines

- **Tenant Context**: propagate `{tenantId, actor}` through use case inputs; never infer implicitly inside domain.
- **Isolation**: enforce at data access (schema/partition/row‑level). Repositories require tenant context.
- **Testing**: unit tests use multiple tenant fixtures; integration verifies isolation policies.
- **Cross‑tenant ops**: only in admin contexts via explicit policies.

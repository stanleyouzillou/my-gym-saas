---
trigger: always_on
---

# Configuration, Secrets & Feature Flags

- **Environment‑based config** (12‑factor). Validate on startup.
- **Secrets** via vault/KMS; never in code or repo history.
- **Feature flags**: progressive delivery, kill‑switches; flags evaluated in application layer, not domain.
- **Versioned config** for migrations and backward compatibility.

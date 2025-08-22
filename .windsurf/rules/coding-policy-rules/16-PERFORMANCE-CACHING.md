---
trigger: always_on
---

# Performance, Caching & Backpressure

- **Perf budgets** per use case (latency, throughput).
- **Caching**: choose levels (client/edge/app/DB); define keys, TTLs, and invalidation via domain events.
- **Concurrency**: idempotency keys, deduplication, rate limits, bulkheads.
- **Backpressure**: queues and retries with jitter; circuit breaking on provider errors.

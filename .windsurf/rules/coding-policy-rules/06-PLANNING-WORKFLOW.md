---
trigger: always_on
---

# Planning: Discovery → Walking Skeleton → Iterations

1. **Event Storming / Context Mapping**
   - Identify domain events, commands, actors, and bounded contexts.
2. **Walking Skeleton (Iteration Zero)**
   - Single request→response through all layers, trivial data store, CI pipeline, deploy target.
3. **Feature Iterations**
   - Each story becomes acceptance scenarios (GWT). Implement with double-loop TDD. Keep slices vertical and shippable.
4. **Modular Monolith First**
   - Clear module boundaries; split only when socio-technical signals support it.

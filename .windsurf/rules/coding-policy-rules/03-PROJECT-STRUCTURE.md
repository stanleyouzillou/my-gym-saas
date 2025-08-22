# Project Structure (Framework-Agnostic, Feature-First)

```
/src
  /modules
    /<bounded-context>/<feature>/
      /domain/            # entities, value_objects, aggregates, domain events, repos (interfaces)
      /application/       # use_cases, dto, ports (interfaces), services (orchestration)
      /infrastructure/    # adapters (db/cache/queue/api), mappers, compose (composition root)
      /presentation/      # controllers, input/output mappers, delivery protocols
  /shared
    /core/domain          # base Entity, VO, AggregateRoot, Result
    /errors               # AppError, DomainError, InfraError
    /infrastructure       # providers: db, cache, auth, events, logging
    /observability        # tracing, logging, metrics glue
    /tenancy              # tenant context/resolution
    /config               # environment loading/validation
/tests
  /unit /integration /acceptance /e2e
/docs
  /rules
```

**Heuristics**
- Co-locate by feature; limit cross-feature imports to interfaces in `shared` or integration contracts.
- Only **compose** adapters in `infrastructure/compose.*` per feature/context.

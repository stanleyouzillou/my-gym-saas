# Scheduling Context

Owner: product@squad

Purpose: Manage programs and class sessions (create/list). Enforce scheduling rules and invariants. Adapters and providers are wired in `infrastructure/compose.ts`.

Structure:
- domain/: entities, value objects, services, events
- application/: ports, use cases, DTOs, errors
- infrastructure/: adapters, providers, composition root
- presentation/: controllers, mappers, validation

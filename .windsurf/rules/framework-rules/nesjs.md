---
trigger: always_on
---

# NestJS-first DDD / Hexagonal guidance (short, practical)

Below is an updated, **NestJS-focused** doc you can drop into your repo (or feed to the agent). It keeps hexagonal/DDD boundaries but _uses Nest DI_ as the canonical composition/wiring mechanism — composition roots = Nest modules/providers. Includes small code snippets and exact references.

---

# 1) High-level rule (one line)

Use **Nest DI & Modules** to wire adapters and SDKs (providers registered in modules / compose files). Keep **domain & application layers framework-agnostic** (no `@nestjs/*` imports). ([NestJS Documentation][1])

---

# 2) How to organize (must-follow)

- `src/modules/<context>/domain/` — Entities, ValueObjects, Aggregates (pure TS).
- `src/modules/<context>/application/` — Use-cases + ports (interfaces/tokens).
- `src/modules/<context>/infrastructure/` — Adapters (Prisma, Stripe, SendGrid), provider factories, `module.ts` / `compose.ts`. **Only** these files import SDKs. ([Medium][2], [DEV Community][3])
- `src/modules/<context>/presentation/` — Controllers, Guards, Pipes, DTOs. Controllers are thin: validate → map → call use-case. Use Nest Guards & Pipes for auth/validation. ([NestJS Documentation][4])

---

# 3) Use Nest DI the “right” way (practical patterns)

1. **Provider tokens** — define tokens for ports in `application/ports.ts` and register adapters in the Nest module:

```ts
// application/ports.ts
export const ISessionRepoToken = 'ISessionRepo';

// infrastructure/prisma/prisma-session.repo.ts
@Injectable()
export class PrismaSessionRepo implements ISessionRepo { ... }

// infrastructure/module.ts (composition)
@Module({
  providers: [
    { provide: ISessionRepoToken, useClass: PrismaSessionRepo },
  ],
  exports: [ISessionRepoToken],
})
export class SchedulingInfrastructureModule {}
```

Use `useClass` / `useFactory` / `useValue` as needed. ([NestJS Documentation][1], [Medium][5])

2. **Dynamic / factory providers** — for SDKs needing async config (Prisma, Stripe):

```ts
{
  provide: PRISMA_CLIENT,
  useFactory: async () => {
    const client = new PrismaClient({ /* options */ });
    await client.$connect();
    return client;
  }
}
```

Prefer singleton scope; only use request scope when necessary. ([NestJS Documentation][6])

3. **Expose a `get<Context>Deps()` module wrapper** (optional) to compose modules in the root `AppModule` for clarity — this is just Nest modules rendered as composition roots. ([GitHub][7])

---

# 4) Guards, Pipes, Validation (where to put them)

- **Guards** for authentication/authorization (Clerk verifier + DB role check). Register guards at controller or route level. Guard should call an auth port (not SDK directly) where possible. ([NestJS Documentation][4])
- **Pipes** for transformation/validation (use Nest `ValidationPipe` + `class-validator` for DTOs). Use DTOs in presentation layer and map to application input DTOs. ([NestJS Documentation][8])

---

# 5) Testing & overrides (fast feedback loop)

- Use Nest testing module and `overrideProvider()` to inject in-memory adapters (or `useValue`) for ports. This makes tests deterministic and keeps DI consistent with production wiring. ([NestJS Documentation][9], [Stack Overflow][10])

Example:

```ts
const moduleRef = await Test.createTestingModule({
  imports: [SchedulingModule],
})
  .overrideProvider(ISessionRepoToken)
  .useValue(new InMemorySessionRepo())
  .compile();
```

---

# 6) Prisma + Nest (best practices)

- Provide a single Prisma client provider (`PRISMA_CLIENT`) created in a provider factory and registered once (in `shared/infrastructure/providers/prisma.module.ts`). Import that module where adapters need DB access — **do not** `new PrismaClient()` inside domain code. ([NestJS Documentation][11], [Medium][12])

---

# 7) Quick anti-patterns (avoid these)

- DO NOT import `@nestjs/*`, Prisma, Stripe or other SDKs inside `domain/` or `application/`. Enforce via ESLint `no-restricted-imports`. ([Better Programming][13])
- DO NOT put business logic in controllers, guards, or pipes — only in use-cases / domain. ([Better Programming][13])

---

# 8) Minimal checklist for the agent (automatic enforcement)

- [ ] Each context has `module.ts` or `compose.ts` that registers providers via Nest DI.
- [ ] All SDK imports appear **only** in `infrastructure/*` or provider modules. (Scan for `from 'stripe'`, `from '@prisma/client'`, `from '@clerk/*'`.) ([NestJS Documentation][1])
- [ ] Ports defined in `application/ports.ts` and mapped to provider tokens in module.
- [ ] Controllers use Guards & ValidationPipe for auth + body validation. ([NestJS Documentation][8])
- [ ] Tests override providers to inject in-memory adapters (use `overrideProvider`). ([NestJS Documentation][9])

---

# 9) Links & references (copyable)

- Nest custom providers (useClass/useValue/useFactory): [https://docs.nestjs.com/fundamentals/custom-providers](https://docs.nestjs.com/fundamentals/custom-providers). ([NestJS Documentation][1])
- Dynamic modules: [https://docs.nestjs.com/fundamentals/dynamic-modules](https://docs.nestjs.com/fundamentals/dynamic-modules). ([NestJS Documentation][6])
- Guards: [https://docs.nestjs.com/guards](https://docs.nestjs.com/guards). ([NestJS Documentation][4])
- Pipes & Validation: [https://docs.nestjs.com/pipes](https://docs.nestjs.com/pipes) and [https://docs.nestjs.com/techniques/validation](https://docs.nestjs.com/techniques/validation). ([NestJS Documentation][14])
- Testing & overrideProvider: [https://docs.nestjs.com/fundamentals/testing](https://docs.nestjs.com/fundamentals/testing). ([NestJS Documentation][9])
- Prisma + Nest recipe: [https://docs.nestjs.com/recipes/prisma](https://docs.nestjs.com/recipes/prisma). ([NestJS Documentation][11])
- Hexagonal / clean architecture patterns in Node/Nest: examples & patterns: [https://github.com/Sairyss/domain-driven-hexagon](https://github.com/Sairyss/domain-driven-hexagon). ([GitHub][7])

---

If you like, I’ll:

- generate an updated `docs/` Markdown file replacing the previous composition-root guidance with this Nest-first pattern, **and** create the ESLint `no-restricted-imports` snippet + a small repo scanner script to enforce "SDK imports only in infrastructure". Want me to generate those two files now?

[1]: https://docs.nestjs.com/fundamentals/custom-providers?utm_source=chatgpt.com "Custom providers | NestJS - A progressive Node.js ..."
[2]: https://medium.com/%40lamjed.gaidi070/hexagonal-onion-and-clean-architecture-in-nestjs-c58b526d9f3f?utm_source=chatgpt.com "Hexagonal, Onion, and Clean Architecture in NestJS"
[3]: https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi?utm_source=chatgpt.com "Hexagonal Architecture and Clean Architecture"
[4]: https://docs.nestjs.com/guards?utm_source=chatgpt.com "Guards | NestJS - A progressive Node.js framework"
[5]: https://medium.com/%40vahid.vdn/nestjs-providers-usevalue-useclass-usefactory-63a71f94da43?utm_source=chatgpt.com "DI-Part 1: NestJS providers: useValue, useClass and ..."
[6]: https://docs.nestjs.com/fundamentals/dynamic-modules?utm_source=chatgpt.com "Dynamic modules | NestJS - A progressive Node.js ..."
[7]: https://github.com/Sairyss/domain-driven-hexagon?utm_source=chatgpt.com "Sairyss/domain-driven-hexagon"
[8]: https://docs.nestjs.com/techniques/validation?utm_source=chatgpt.com "Validation | NestJS - A progressive Node.js framework"
[9]: https://docs.nestjs.com/fundamentals/testing?utm_source=chatgpt.com "Testing | NestJS - A progressive Node.js framework"
[10]: https://stackoverflow.com/questions/69000993/nestjs-overrideprovider-vs-provider-in-unit-testing?utm_source=chatgpt.com "Nestjs overrideProvider vs provider in unit testing"
[11]: https://docs.nestjs.com/recipes/prisma?utm_source=chatgpt.com "Prisma | NestJS - A progressive Node.js framework"
[12]: https://medium.com/%40rishabhgupta7210012474/practical-guide-to-integrating-prisma-with-nestjs-for-seamless-development-9f91e83cc990?utm_source=chatgpt.com "Practical Guide to Integrating Prisma with NestJS for ..."
[13]: https://betterprogramming.pub/clean-node-js-architecture-with-nestjs-and-typescript-34b9398d790f?utm_source=chatgpt.com "Clean Node.js Architecture —With NestJs and TypeScript"
[14]: https://docs.nestjs.com/pipes?utm_source=chatgpt.com "Pipes | NestJS - A progressive Node.js framework"

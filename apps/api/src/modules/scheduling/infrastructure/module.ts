import { Module } from '@nestjs/common';
import { ISessionRepoToken, IBookingRepoToken, IWaitlistRepoToken, ListSessionsUseCaseToken, CreateSessionUseCaseToken, RegisterForSessionUseCaseToken } from '../application/tokens';
import { InMemorySessionRepo, seedSessions } from './adapters/inMemory/sessionRepo';
import { PrismaSessionRepo } from './adapters/prisma/sessionRepo';
import { getPrisma } from './providers/db/prismaClient';
import { InMemoryBookingRepo } from './adapters/inMemory/bookingRepo';
import { InMemoryWaitlistRepo } from './adapters/inMemory/waitlistRepo';
import { ListSessionsUseCase } from '../application/use_cases/listSessions';
import { CreateSessionUseCase } from '../application/use_cases/createSession';
import { RegisterForSessionUseCase } from '../application/use_cases/registerForSession';
import { SystemClock } from './providers/clock/systemClock';
import { UuidProvider } from './providers/id/uuidProvider';
import { InMemoryEventBus } from './providers/events/inMemoryEventBus';

@Module({
  providers: [
    // Providers for repos
    {
      provide: ISessionRepoToken,
      useFactory: () => {
        const useDb = process.env.USE_DB_PRISMA === 'true';
        return useDb ? new PrismaSessionRepo(getPrisma()) : new InMemorySessionRepo(seedSessions());
      },
    },
    { provide: IBookingRepoToken, useClass: InMemoryBookingRepo },
    { provide: IWaitlistRepoToken, useClass: InMemoryWaitlistRepo },

    // Cross-cutting providers
    { provide: SystemClock, useClass: SystemClock },
    { provide: UuidProvider, useClass: UuidProvider },
    { provide: InMemoryEventBus, useClass: InMemoryEventBus },

    // Use cases
    {
      provide: ListSessionsUseCaseToken,
      useFactory: (sessionsRepo: any) => new ListSessionsUseCase(sessionsRepo),
      inject: [ISessionRepoToken],
    },
    {
      provide: CreateSessionUseCaseToken,
      useFactory: (sessionsRepo: any, clock: SystemClock, ids: UuidProvider, events: InMemoryEventBus) =>
        new CreateSessionUseCase(sessionsRepo, clock, ids, events),
      inject: [ISessionRepoToken, SystemClock, UuidProvider, InMemoryEventBus],
    },
    {
      provide: RegisterForSessionUseCaseToken,
      useFactory: (
        sessionsRepo: any,
        bookingRepo: any,
        waitlistRepo: any,
        clock: SystemClock,
        ids: UuidProvider,
      ) => new RegisterForSessionUseCase(sessionsRepo, bookingRepo, waitlistRepo, clock, ids),
      inject: [ISessionRepoToken, IBookingRepoToken, IWaitlistRepoToken, SystemClock, UuidProvider],
    },
  ],
  exports: [
    ISessionRepoToken,
    IBookingRepoToken,
    IWaitlistRepoToken,
    ListSessionsUseCaseToken,
    CreateSessionUseCaseToken,
    RegisterForSessionUseCaseToken,
  ],
})
export class SchedulingModule {}

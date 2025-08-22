import { Module } from '@nestjs/common';
import {
  ISessionRepoToken,
  IBookingRepoToken,
  IWaitlistRepoToken,
  ListSessionsUseCaseToken,
  CreateSessionUseCaseToken,
  RegisterForSessionUseCaseToken,
  IClockToken,
  IIdProviderToken,
  IEventBusToken,
} from '../application/tokens';
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
import { Clock } from '../application/ports/Clock';
import { IdProvider } from '../application/ports/IdProvider';
import { EventBus } from '../application/ports/EventBus';
import { SessionRepo } from '../application/ports/SessionRepo';
import { IBookingRepo } from '../application/ports/BookingRepo';
import { IWaitlistRepo } from '../application/ports/WaitlistRepo';

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
    { provide: IClockToken, useClass: SystemClock },
    { provide: IIdProviderToken, useClass: UuidProvider },
    { provide: IEventBusToken, useClass: InMemoryEventBus },

    // Use cases
    {
      provide: ListSessionsUseCaseToken,
      useFactory: (sessionsRepo: SessionRepo) => new ListSessionsUseCase(sessionsRepo),
      inject: [ISessionRepoToken],
    },
    {
      provide: CreateSessionUseCaseToken,
      useFactory: (sessionsRepo: SessionRepo, clock: Clock, ids: IdProvider, events: EventBus) =>
        new CreateSessionUseCase(sessionsRepo, clock, ids, events),
      inject: [ISessionRepoToken, IClockToken, IIdProviderToken, IEventBusToken],
    },
    {
      provide: RegisterForSessionUseCaseToken,
      useFactory: (
        sessionsRepo: SessionRepo,
        bookingRepo: IBookingRepo,
        waitlistRepo: IWaitlistRepo,
        clock: Clock,
        ids: IdProvider,
      ) => new RegisterForSessionUseCase(sessionsRepo, bookingRepo, waitlistRepo, clock, ids),
      inject: [ISessionRepoToken, IBookingRepoToken, IWaitlistRepoToken, IClockToken, IIdProviderToken],
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

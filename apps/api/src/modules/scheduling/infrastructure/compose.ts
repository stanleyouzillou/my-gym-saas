import {
  InMemorySessionRepo,
  seedSessions,
} from './adapters/inMemory/sessionRepo';
import { PrismaSessionRepo } from './adapters/prisma/sessionRepo';
import { getPrisma } from './providers/db/prismaClient';
import { SessionRepo } from '../application/ports/SessionRepo';
import { ListSessionsUseCase } from '../application/use_cases/listSessions';
import { CreateSessionUseCase } from '../application/use_cases/createSession';
import { SystemClock } from './providers/clock/systemClock';
import { UuidProvider } from './providers/id/uuidProvider';
import { InMemoryEventBus } from './providers/events/inMemoryEventBus';
import { InMemoryBookingRepo } from './adapters/inMemory/bookingRepo';
import { InMemoryWaitlistRepo } from './adapters/inMemory/waitlistRepo';
import { RegisterForSessionUseCase } from '../application/use_cases/registerForSession';

export type SchedulingDeps = {
  listSessions: ListSessionsUseCase;
  createSession: CreateSessionUseCase;
  registerForSession: RegisterForSessionUseCase;
};

let singleton: SchedulingDeps | null = null;
let repo: SessionRepo = new InMemorySessionRepo(seedSessions());
const useDb = process.env.USE_DB_PRISMA === 'true';
if (useDb) {
  repo = new PrismaSessionRepo(getPrisma());
}
const clock = new SystemClock();
const ids = new UuidProvider();
const events = new InMemoryEventBus();
const bookingRepo = new InMemoryBookingRepo();
const waitlistRepo = new InMemoryWaitlistRepo();

export function getSchedulingDeps(): SchedulingDeps {
  if (!singleton) {
    const listSessions = new ListSessionsUseCase(repo);
    const createSession = new CreateSessionUseCase(repo, clock, ids, events);
    const registerForSession = new RegisterForSessionUseCase(
      repo,
      bookingRepo,
      waitlistRepo,
      clock,
      ids,
    );
    singleton = { listSessions, createSession, registerForSession };
  }
  return singleton;
}

export function resetSchedulingDeps() {
  // Always reset to in-memory for tests by default
  repo = new InMemorySessionRepo(seedSessions());
  // reset singleton to rebuild with fresh repo
  singleton = null;
  events.clear();
}

export function getEventStore() {
  return events;
}

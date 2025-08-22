import {
  ListParams,
  Session,
  SessionRepo,
} from '../../../application/ports/SessionRepo';

export class InMemorySessionRepo implements SessionRepo {
  private sessions: Session[] = [];

  constructor(seed?: Session[]) {
    if (seed) this.sessions = seed;
  }

  async findByProgram(programId: string): Promise<Session[]> {
    return this.sessions.filter((s) => s.programId === programId);
  }

  async list(params: ListParams = {}): Promise<Session[]> {
    const { programId, from, to } = params;
    return this.sessions.filter((s) => {
      const okProgram = programId ? s.programId === programId : true;
      const startMs = s.startTime.getTime();
      const okFrom = from ? startMs >= from.getTime() : true;
      const okTo = to ? startMs <= to.getTime() : true;
      return okProgram && okFrom && okTo;
    });
  }

  async getById(id: string): Promise<Session | null> {
    return this.sessions.find((s) => s.id === id) ?? null;
  }

  async save(session: Session): Promise<void> {
    const idx = this.sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) this.sessions[idx] = session;
    else this.sessions.push(session);
  }
}

export function seedSessions(): Session[] {
  return [
    {
      id: 'sess_1',
      programId: 'prog_yoga_basics',
      startTime: new Date('2025-09-01T10:00:00Z'),
      durationMinutes: 60,
      maxCapacity: 10,
      coachName: 'Coach A',
    },
  ];
}

export interface Session {
  id: string;
  programId: string;
  startTime: Date;
  durationMinutes: number;
  maxCapacity: number;
  coachName?: string;
}

export interface ListParams {
  programId?: string;
  from?: Date;
  to?: Date;
}

export interface SessionRepo {
  list(params?: ListParams): Promise<Session[]>;
  findByProgram(programId: string): Promise<Session[]>;
  getById(id: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
}

// Alias to satisfy naming preference in workflows/specs
export type ISessionRepository = SessionRepo;

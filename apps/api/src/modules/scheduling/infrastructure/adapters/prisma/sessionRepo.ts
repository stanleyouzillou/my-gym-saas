import { PrismaClient } from '@prisma/client';
import {
  ListParams,
  Session,
  SessionRepo,
} from '../../../application/ports/SessionRepo';

export class PrismaSessionRepo implements SessionRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findByProgram(programId: string): Promise<Session[]> {
    const rows = await this.prisma.classSession.findMany({
      where: { programId },
      orderBy: { startsAt: 'asc' },
      select: {
        id: true,
        programId: true,
        startsAt: true,
        durationMin: true,
        capacity: true,
        coachName: true,
      },
    } as any);
    return (rows as any[]).map(mapRowToSession);
  }

  async list(params: ListParams = {}): Promise<Session[]> {
    const where: any = {};
    if (params.programId) where.programId = params.programId;
    if (params.from || params.to) {
      where.startsAt = {} as any;
      if (params.from) where.startsAt.gte = params.from;
      if (params.to) where.startsAt.lte = params.to;
    }

    const rows = await this.prisma.classSession.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      select: {
        id: true,
        programId: true,
        startsAt: true,
        durationMin: true,
        capacity: true,
        coachName: true,
      },
    } as any);
    return (rows as any[]).map(mapRowToSession);
  }

  async getById(id: string): Promise<Session | null> {
    const row = await this.prisma.classSession.findUnique({ where: { id } });
    return row ? mapRowToSession(row) : null;
  }

  async save(session: Session): Promise<void> {
    await (this.prisma.classSession as any).upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        programId: session.programId,
        startsAt: session.startTime,
        durationMin: session.durationMinutes,
        capacity: session.maxCapacity,
        coachName: session.coachName ?? null,
      } as any,
      update: {
        programId: session.programId,
        startsAt: session.startTime,
        durationMin: session.durationMinutes,
        capacity: session.maxCapacity,
        coachName: session.coachName ?? null,
      } as any,
    });
  }
}

function mapRowToSession(row: any): Session {
  return {
    id: row.id,
    programId: row.programId,
    startTime: new Date(row.startsAt),
    durationMinutes: row.durationMin,
    maxCapacity: row.capacity,
    coachName: row.coachName ?? undefined,
  };
}

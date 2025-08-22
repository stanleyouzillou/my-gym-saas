import { CreateSessionUseCase } from './createSession';
import { SessionRepo, Session } from '../ports/SessionRepo';
import { Clock } from '../ports/Clock';
import { IdProvider } from '../ports/IdProvider';
import { EventBus } from '../ports/EventBus';

describe('CreateSessionUseCase', () => {
  class FakeRepo implements SessionRepo {
    store: Session[] = [];
    async list() {
      return this.store;
    }
    async findByProgram(programId: string) {
      return this.store.filter((s) => s.programId === programId);
    }
    async getById(id: string) {
      return this.store.find((s) => s.id === id) ?? null;
    }
    async save(s: Session) {
      this.store.push(s);
    }
  }
  const fixedNow = new Date('2025-01-01T00:00:00Z');
  const clock: Clock = { now: () => fixedNow };
  const ids: IdProvider = { next: () => 'id_1' };
  const events: EventBus = { emit: (_e) => {} };

  it('returns MissingProgramId when programId is missing', async () => {
    const repo = new FakeRepo();
    const uc = new CreateSessionUseCase(repo, clock, ids, events);
    const r = await uc.execute({
      startTime: '2025-09-01T10:00:00Z',
      durationMinutes: 60,
      maxCapacity: 10,
    } as any);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toEqual({ kind: 'MissingProgramId' });
  });

  it('returns InvalidCapacity when maxCapacity < 1', async () => {
    const repo = new FakeRepo();
    const uc = new CreateSessionUseCase(repo, clock, ids, events);
    const r = await uc.execute({
      programId: 'prog1',
      startTime: '2025-09-01T10:00:00Z',
      durationMinutes: 60,
      maxCapacity: 0,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toEqual({ kind: 'InvalidCapacity' });
  });

  it('persists session on valid input', async () => {
    const repo = new FakeRepo();
    const uc = new CreateSessionUseCase(repo, clock, ids, events);
    const r = await uc.execute({
      programId: 'prog1',
      startTime: '2025-09-01T10:00:00Z',
      durationMinutes: 60,
      maxCapacity: 12,
      coachName: 'Coach A',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) throw new Error('expected ok');
    const created = r.value;
    expect(created.id).toBe('id_1');
    expect(repo.store).toHaveLength(1);
    expect(repo.store[0].programId).toBe('prog1');
  });
});

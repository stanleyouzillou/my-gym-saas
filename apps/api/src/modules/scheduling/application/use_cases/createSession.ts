import { SessionRepo, Session } from '../ports/SessionRepo';
import { Clock } from '../ports/Clock';
import { IdProvider } from '../ports/IdProvider';
import { Result, ok, err } from '../common/result';
import { EventBus } from '../ports/EventBus';

export class CreateSessionUseCase {
  constructor(
    private readonly repo: SessionRepo,
    private readonly clock: Clock,
    private readonly ids: IdProvider,
    private readonly events: EventBus,
  ) {}

  async execute(input: {
    programId?: string;
    startTime?: string;
    durationMinutes?: number;
    maxCapacity?: number;
    coachName?: string;
  }): Promise<Result<Session, CreateSessionError>> {
    if (!input.programId) return err({ kind: 'MissingProgramId' });
    const duration = input.durationMinutes;
    if (
      typeof duration !== 'number' ||
      !Number.isFinite(duration) ||
      duration < 1
    ) {
      return err({ kind: 'InvalidDuration' });
    }
    const capacity = input.maxCapacity;
    if (
      typeof capacity !== 'number' ||
      !Number.isFinite(capacity) ||
      capacity < 1
    ) {
      return err({ kind: 'InvalidCapacity' });
    }

    const start = new Date(input.startTime ?? '');
    if (isNaN(start.getTime())) return err({ kind: 'InvalidStartTime' });

    const session: Session = {
      id: this.ids.next(),
      programId: input.programId,
      startTime: start,
      durationMinutes: duration,
      maxCapacity: capacity,
      coachName: input.coachName,
    };

    await this.repo.save(session);
    this.events.emit({
      type: 'SessionScheduled',
      payload: {
        id: session.id,
        programId: session.programId,
        startTime: session.startTime.toISOString(),
      },
      occurredAt: this.clock.now().toISOString(),
    });
    return ok(session);
  }
}

export type CreateSessionError =
  | { kind: 'MissingProgramId' }
  | { kind: 'InvalidDuration' }
  | { kind: 'InvalidCapacity' }
  | { kind: 'InvalidStartTime' };

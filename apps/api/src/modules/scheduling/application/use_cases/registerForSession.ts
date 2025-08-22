import { SessionRepo } from '../ports/SessionRepo';
import { IBookingRepo } from '../ports/BookingRepo';
import { IWaitlistRepo } from '../ports/WaitlistRepo';
import type { Result } from '../common/result';
import { ok, err } from '../common/result';
import { Clock } from '../ports/Clock';
import { IdProvider } from '../ports/IdProvider';
import { BookingEntity } from '../../domain/entities/Booking';
import { WaitlistEntryEntity } from '../../domain/entities/WaitlistEntry';
import { BookingId } from '../../domain/value_objects/BookingId';
import { WaitlistEntryId } from '../../domain/value_objects/WaitlistEntryId';
import { SessionId } from '../../domain/value_objects/SessionId';
import { MemberId } from '../../domain/value_objects/MemberId';

export type RegisterOk = { kind: 'BOOKED'; booking: BookingEntity } | { kind: 'WAITLISTED'; entry: WaitlistEntryEntity };
export type RegisterErr =
  | { kind: 'SessionNotFound' }
  | { kind: 'AlreadyRegistered' };

export class RegisterForSessionUseCase {
  constructor(
    private readonly sessions: SessionRepo,
    private readonly bookings: IBookingRepo,
    private readonly waitlist: IWaitlistRepo,
    private readonly clock: Clock,
    private readonly ids: IdProvider,
  ) {}

  async execute(memberIdRaw: string, sessionIdRaw: string): Promise<Result<RegisterOk, RegisterErr>> {
    const sessionId = SessionId.create(sessionIdRaw);
    const memberId = MemberId.create(memberIdRaw);

    const session = await this.sessions.getById(sessionId.value);
    if (!session) return err({ kind: 'SessionNotFound' });

    const existing = await this.bookings.findByMemberSession(memberId, sessionId);
    if (existing) return err({ kind: 'AlreadyRegistered' });

    const count = await this.bookings.countBySession(sessionId);
    if (count < session.maxCapacity) {
      const booking = BookingEntity.create({
        id: BookingId.create(this.ids.next()),
        sessionId,
        memberId,
        createdAt: this.clock.now(),
      });
      await this.bookings.create(booking);
      return ok({ kind: 'BOOKED', booking });
    }

    const position = (await this.waitlist.countBySession(sessionId)) + 1;
    const entry = WaitlistEntryEntity.create({
      id: WaitlistEntryId.create(this.ids.next()),
      sessionId,
      memberId,
      position,
      createdAt: this.clock.now(),
    });
    await this.waitlist.enqueue(entry);
    return ok({ kind: 'WAITLISTED', entry });
  }
}

import { SessionRepo } from '../ports/SessionRepo';
import { IBookingRepo, Booking } from '../ports/BookingRepo';
import { IWaitlistRepo, WaitlistEntry } from '../ports/WaitlistRepo';
import type { Result } from '../common/result';
import { ok, err } from '../common/result';
import { Clock } from '../ports/Clock';
import { IdProvider } from '../ports/IdProvider';

export type RegisterOk = { kind: 'BOOKED'; booking: Booking } | { kind: 'WAITLISTED'; entry: WaitlistEntry };
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

  async execute(memberId: string, sessionId: string): Promise<Result<RegisterOk, RegisterErr>> {
    const session = await this.sessions.getById(sessionId);
    if (!session) return err({ kind: 'SessionNotFound' });

    const existing = await this.bookings.findByMemberSession(memberId, sessionId);
    if (existing) return err({ kind: 'AlreadyRegistered' });

    const count = await this.bookings.countBySession(sessionId);
    if (count < session.maxCapacity) {
      const booking: Booking = {
        id: this.ids.next(),
        sessionId,
        memberId,
        createdAt: this.clock.now(),
      };
      await this.bookings.create(booking);
      return ok({ kind: 'BOOKED', booking });
    }

    const position = (await this.waitlist.countBySession(sessionId)) + 1;
    const entry: WaitlistEntry = {
      id: this.ids.next(),
      sessionId,
      memberId,
      position,
      createdAt: this.clock.now(),
    };
    await this.waitlist.enqueue(entry);
    return ok({ kind: 'WAITLISTED', entry });
  }
}

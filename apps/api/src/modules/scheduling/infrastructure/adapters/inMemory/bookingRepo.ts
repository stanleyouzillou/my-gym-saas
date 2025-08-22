import { IBookingRepo } from '../../../application/ports/BookingRepo';
import { BookingEntity } from '../../../domain/entities/Booking';
import { SessionId } from '../../../domain/value_objects/SessionId';
import { MemberId } from '../../../domain/value_objects/MemberId';

export class InMemoryBookingRepo implements IBookingRepo {
  private items: BookingEntity[] = [];

  async create(booking: BookingEntity): Promise<void> {
    this.items.push(booking);
  }
  async countBySession(sessionId: SessionId): Promise<number> {
    return this.items.filter(b => b.sessionId.value === sessionId.value).length;
  }
  async findByMemberSession(memberId: MemberId, sessionId: SessionId): Promise<BookingEntity | null> {
    return this.items.find(b => b.memberId.value === memberId.value && b.sessionId.value === sessionId.value) ?? null;
  }
  clear() { this.items = []; }
}

import { IBookingRepo, Booking } from '../../../application/ports/BookingRepo';

export class InMemoryBookingRepo implements IBookingRepo {
  private items: Booking[] = [];

  async create(booking: Booking): Promise<void> {
    this.items.push(booking);
  }
  async countBySession(sessionId: string): Promise<number> {
    return this.items.filter(b => b.sessionId === sessionId).length;
  }
  async findByMemberSession(memberId: string, sessionId: string): Promise<Booking | null> {
    return this.items.find(b => b.memberId === memberId && b.sessionId === sessionId) ?? null;
  }
  clear() { this.items = []; }
}

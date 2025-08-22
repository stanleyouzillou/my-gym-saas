import { BookingEntity } from '../../domain/entities/Booking';
import { SessionId } from '../../domain/value_objects/SessionId';
import { MemberId } from '../../domain/value_objects/MemberId';

export interface IBookingRepo {
  create(booking: BookingEntity): Promise<void>;
  countBySession(sessionId: SessionId): Promise<number>;
  findByMemberSession(memberId: MemberId, sessionId: SessionId): Promise<BookingEntity | null>;
}

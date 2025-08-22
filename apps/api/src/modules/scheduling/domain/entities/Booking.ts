import { BookingId } from '../value_objects/BookingId';
import { SessionId } from '../value_objects/SessionId';
import { MemberId } from '../value_objects/MemberId';

export class BookingEntity {
  private constructor(
    public readonly id: BookingId,
    public readonly sessionId: SessionId,
    public readonly memberId: MemberId,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    id: BookingId;
    sessionId: SessionId;
    memberId: MemberId;
    createdAt: Date;
  }): BookingEntity {
    const { id, sessionId, memberId, createdAt } = params;
    if (!createdAt) throw new Error('createdAt is required');
    return new BookingEntity(id, sessionId, memberId, createdAt);
  }
}

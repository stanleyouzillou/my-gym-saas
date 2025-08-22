import { WaitlistEntryId } from '../value_objects/WaitlistEntryId';
import { SessionId } from '../value_objects/SessionId';
import { MemberId } from '../value_objects/MemberId';

export class WaitlistEntryEntity {
  private constructor(
    public readonly id: WaitlistEntryId,
    public readonly sessionId: SessionId,
    public readonly memberId: MemberId,
    public readonly position: number,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    id: WaitlistEntryId;
    sessionId: SessionId;
    memberId: MemberId;
    position: number;
    createdAt: Date;
  }): WaitlistEntryEntity {
    const { id, sessionId, memberId, position, createdAt } = params;
    if (!Number.isInteger(position) || position <= 0) {
      throw new Error('position must be a positive integer');
    }
    if (!createdAt) throw new Error('createdAt is required');
    return new WaitlistEntryEntity(id, sessionId, memberId, position, createdAt);
  }
}

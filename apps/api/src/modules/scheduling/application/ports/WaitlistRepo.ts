import { WaitlistEntryEntity } from '../../domain/entities/WaitlistEntry';
import { SessionId } from '../../domain/value_objects/SessionId';
import { MemberId } from '../../domain/value_objects/MemberId';

export interface IWaitlistRepo {
  enqueue(entry: WaitlistEntryEntity): Promise<void>;
  countBySession(sessionId: SessionId): Promise<number>;
  findByMemberSession(memberId: MemberId, sessionId: SessionId): Promise<WaitlistEntryEntity | null>;
}

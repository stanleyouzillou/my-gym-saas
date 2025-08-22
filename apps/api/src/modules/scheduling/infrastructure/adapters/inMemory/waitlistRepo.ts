import { IWaitlistRepo } from '../../../application/ports/WaitlistRepo';
import { WaitlistEntryEntity } from '../../../domain/entities/WaitlistEntry';
import { SessionId } from '../../../domain/value_objects/SessionId';
import { MemberId } from '../../../domain/value_objects/MemberId';

export class InMemoryWaitlistRepo implements IWaitlistRepo {
  private items: WaitlistEntryEntity[] = [];

  async enqueue(entry: WaitlistEntryEntity): Promise<void> {
    this.items.push(entry);
  }
  async countBySession(sessionId: SessionId): Promise<number> {
    return this.items.filter(e => e.sessionId.value === sessionId.value).length;
  }
  async findByMemberSession(memberId: MemberId, sessionId: SessionId): Promise<WaitlistEntryEntity | null> {
    return this.items.find(e => e.memberId.value === memberId.value && e.sessionId.value === sessionId.value) ?? null;
  }
  clear() { this.items = []; }
}

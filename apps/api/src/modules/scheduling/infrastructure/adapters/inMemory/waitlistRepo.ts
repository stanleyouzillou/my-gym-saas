import { IWaitlistRepo, WaitlistEntry } from '../../../application/ports/WaitlistRepo';

export class InMemoryWaitlistRepo implements IWaitlistRepo {
  private items: WaitlistEntry[] = [];

  async enqueue(entry: WaitlistEntry): Promise<void> {
    this.items.push(entry);
  }
  async countBySession(sessionId: string): Promise<number> {
    return this.items.filter(e => e.sessionId === sessionId).length;
  }
  async findByMemberSession(memberId: string, sessionId: string): Promise<WaitlistEntry | null> {
    return this.items.find(e => e.memberId === memberId && e.sessionId === sessionId) ?? null;
  }
  clear() { this.items = []; }
}

export interface WaitlistEntry {
  id: string;
  sessionId: string;
  memberId: string;
  position: number;
  createdAt: Date;
}

export interface IWaitlistRepo {
  enqueue(entry: WaitlistEntry): Promise<void>;
  countBySession(sessionId: string): Promise<number>;
  findByMemberSession(memberId: string, sessionId: string): Promise<WaitlistEntry | null>;
}

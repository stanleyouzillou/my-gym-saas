export class WaitlistEntryEntity {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly memberId: string,
    public readonly position: number,
    public readonly createdAt: Date,
  ) {}
}

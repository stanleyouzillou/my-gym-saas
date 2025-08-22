export class BookingEntity {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly memberId: string,
    public readonly createdAt: Date,
  ) {}
}

export interface Booking {
  id: string;
  sessionId: string;
  memberId: string;
  createdAt: Date;
}

export interface IBookingRepo {
  create(booking: Booking): Promise<void>;
  countBySession(sessionId: string): Promise<number>;
  findByMemberSession(memberId: string, sessionId: string): Promise<Booking | null>;
}

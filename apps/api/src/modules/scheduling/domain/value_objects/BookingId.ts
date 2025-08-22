export class BookingId {
  private constructor(public readonly value: string) {}

  static create(raw: string): BookingId {
    if (!raw || raw.trim().length === 0) throw new Error('BookingId cannot be empty');
    return new BookingId(raw);
  }

  equals(other: BookingId): boolean {
    return this.value === other.value;
  }
}

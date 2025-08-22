export class SessionId {
  private constructor(public readonly value: string) {}

  static create(raw: string): SessionId {
    if (!raw || raw.trim().length === 0) throw new Error('SessionId cannot be empty');
    return new SessionId(raw);
  }

  equals(other: SessionId): boolean {
    return this.value === other.value;
  }
}

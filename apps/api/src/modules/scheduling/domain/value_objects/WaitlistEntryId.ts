export class WaitlistEntryId {
  private constructor(public readonly value: string) {}

  static create(raw: string): WaitlistEntryId {
    if (!raw || raw.trim().length === 0) throw new Error('WaitlistEntryId cannot be empty');
    return new WaitlistEntryId(raw);
  }

  equals(other: WaitlistEntryId): boolean {
    return this.value === other.value;
  }
}

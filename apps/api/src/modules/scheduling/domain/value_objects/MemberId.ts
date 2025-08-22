export class MemberId {
  private constructor(public readonly value: string) {}

  static create(raw: string): MemberId {
    if (!raw || raw.trim().length === 0) throw new Error('MemberId cannot be empty');
    return new MemberId(raw);
  }

  equals(other: MemberId): boolean {
    return this.value === other.value;
  }
}

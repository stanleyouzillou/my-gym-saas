// Value Object: Email (immutable)

export class Email {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    const normalized = raw?.trim().toLowerCase();
    if (!normalized) throw new Error('Email is required');
    // Simple RFC5322-ish check (can be replaced by stricter validation later)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(normalized)) throw new Error('Invalid email');
    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

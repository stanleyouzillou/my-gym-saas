// Value Object: Capacity (immutable, positive integer)

export class Capacity {
  public readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(raw: number): Capacity {
    if (!Number.isInteger(raw)) throw new Error('Capacity must be an integer');
    if (raw <= 0) throw new Error('Capacity must be > 0');
    if (raw > 10000) throw new Error('Capacity too large');
    return new Capacity(raw);
  }

  equals(other: Capacity): boolean {
    return this.value === other.value;
  }
}

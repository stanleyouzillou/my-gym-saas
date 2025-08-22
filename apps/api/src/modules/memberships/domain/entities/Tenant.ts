// Domain Entity: Tenant (pure TS)

export class Tenant {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;

  private constructor(params: { id?: string; name: string; createdAt?: Date }) {
    this.id = params.id ?? '';
    this.name = params.name;
    this.createdAt = params.createdAt ?? new Date(0);
    if (!this.name) throw new Error('Tenant.name is required');
  }

  static create(params: { id?: string; name: string; createdAt?: Date }): Tenant {
    return new Tenant(params);
  }
}

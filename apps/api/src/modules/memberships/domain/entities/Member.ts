// Domain Entity: Member
// No framework/SDK imports; pure TypeScript

import { Email } from '../value_objects/Email';

export class Member {
  // Identity of the entity
  public readonly id: string;
  public readonly tenantId: string;
  // Value Object for email
  public readonly email: Email;
  // Domain timestamps as primitives (can be wrapped later if needed)
  public readonly createdAt: Date;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly clerkUserId?: string;
  public readonly phone?: string;
  public readonly status?: 'PENDING' | 'ACTIVE';
  public readonly activatedAt?: Date | null;

  private constructor(params: {
    id?: string;
    tenantId: string;
    email: Email;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    clerkUserId?: string;
    phone?: string;
    status?: 'PENDING' | 'ACTIVE';
    activatedAt?: Date | null;
  }) {
    this.id = params.id ?? '';
    this.tenantId = params.tenantId;
    this.email = params.email;
    this.createdAt = params.createdAt ?? new Date(0);
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.clerkUserId = params.clerkUserId;
    this.phone = params.phone;
    this.status = params.status;
    this.activatedAt = params.activatedAt ?? null;
    // Invariants can be expanded here as the model evolves
    // id may be assigned by repository; allow empty during creation
    if (!this.tenantId) throw new Error('Member.tenantId is required');
    if (!this.firstName && !this.lastName) {
      // Allow blank names but keep explicit check if business wants at least one
    }
  }

  // Factory to enforce invariants at creation time
  static create(params: {
    id: string;
    tenantId: string;
    email: Email;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    clerkUserId?: string;
    phone?: string;
    status?: 'PENDING' | 'ACTIVE';
    activatedAt?: Date | null;
  }): Member {
    return new Member(params);
  }

  // Example behavior method (placeholder for future domain logic)
  withEmail(email: Email): Member {
    // Immutable update pattern — return a new instance if you prefer immutability
    return new Member({
      id: this.id,
      tenantId: this.tenantId,
      email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
    });
  }
}

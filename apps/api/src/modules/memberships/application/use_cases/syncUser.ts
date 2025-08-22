import type { IMemberRepository } from '../ports/MemberRepo';
import type { ITenantRepository } from '../ports/TenantRepo';
import { Email } from '../../domain/value_objects/Email';
import { Member } from '../../domain/entities/Member';
import { Tenant } from '../../domain/entities/Tenant';

export type SyncUserInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'member' | 'franchise_admin' | 'coach';
  tenantName: string; // e.g., franchise name
  clerkUserId?: string;
  phone?: string;
  status?: 'PENDING' | 'ACTIVE';
};

export class SyncUserUseCase {
  constructor(
    private readonly tenants: ITenantRepository,
    private readonly members: IMemberRepository,
  ) {}

  async execute(
    input: SyncUserInput,
  ): Promise<
    | { ok: true; tenant: Tenant; member?: Member }
    | { ok: false; error: { kind: string; message?: string } }
  > {
    if (!input.email) return { ok: false, error: { kind: 'MissingEmail' } };
    if (!input.tenantName)
      return { ok: false, error: { kind: 'MissingTenant' } };

    // Ensure tenant exists (idempotent)
    let tenant = await this.tenants.findByName(input.tenantName);
    if (!tenant) {
      tenant = await this.tenants.create(input.tenantName);
    }

    if (input.role === 'member') {
      const email = Email.create(input.email);
      const existing = await this.members.findByEmail(email);
      if (existing) {
        // Ensure tenant association is correct; update if needed
        if (
          existing.tenantId !== tenant.id ||
          existing.firstName !== (input.firstName || existing.firstName) ||
          existing.lastName !== (input.lastName || existing.lastName)
        ) {
          const updated = Member.create({
            id: existing.id,
            tenantId: tenant.id,
            email: existing.email,
            firstName: input.firstName ?? existing.firstName,
            lastName: input.lastName ?? existing.lastName,
            createdAt: existing.createdAt,
            clerkUserId: input.clerkUserId ?? existing.clerkUserId,
            phone: input.phone ?? existing.phone,
            status: input.status ?? existing.status,
          });
          await this.members.save(updated);
        }
        return {
          ok: true,
          tenant,
          member: Member.create({
            id: existing.id,
            tenantId: tenant.id,
            email: existing.email,
            firstName: input.firstName ?? existing.firstName,
            lastName: input.lastName ?? existing.lastName,
            createdAt: existing.createdAt,
            clerkUserId: input.clerkUserId ?? existing.clerkUserId,
            phone: input.phone ?? existing.phone,
            status: input.status ?? existing.status,
          }),
        };
      }
      const member = Member.create({
        id: '', // repository may assign id
        tenantId: tenant.id,
        email,
        firstName: input.firstName || '',
        lastName: input.lastName || '',
        createdAt: new Date(),
        clerkUserId: input.clerkUserId,
        phone: input.phone,
        status: input.status ?? 'PENDING',
      });
      await this.members.save(member);
      // Re-read to get generated id/createdAt
      const saved = await this.members.findByEmail(email);
      return { ok: true, tenant, member: saved || member };
    }

    // For franchise_admin and coach today, only ensure tenant. No member row created.
    return { ok: true, tenant };
  }
}

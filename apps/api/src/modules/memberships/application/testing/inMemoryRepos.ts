import { IMemberRepository } from '../ports/MemberRepo';
import { ITenantRepository } from '../ports/TenantRepo';
import { Member } from '../../domain/entities/Member';
import { Email } from '../../domain/value_objects/Email';
import { Tenant } from '../../domain/entities/Tenant';

export class InMemoryMemberRepository implements IMemberRepository {
  private byEmail = new Map<string, Member>();

  async save(member: Member): Promise<void> {
    // emulate id assignment
    const id = member.id || `mem_${this.byEmail.size + 1}`;
    const copy = Member.create({
      id,
      tenantId: member.tenantId,
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      createdAt: member.createdAt ?? new Date(),
    });
    this.byEmail.set(copy.email.value, copy);
  }

  async findByEmail(email: Email): Promise<Member | null> {
    return this.byEmail.get(email.value) ?? null;
  }

  async findByTenant(tenantId: string): Promise<Member[]> {
    return Array.from(this.byEmail.values()).filter((m) => m.tenantId === tenantId);
  }
}

export class InMemoryTenantRepository implements ITenantRepository {
  private byName = new Map<string, Tenant>();

  async findByName(name: string): Promise<Tenant | null> {
    return this.byName.get(name) ?? null;
  }

  async create(name: string): Promise<Tenant> {
    const id = `ten_${this.byName.size + 1}`;
    const tenant = Tenant.create({ id, name, createdAt: new Date() });
    this.byName.set(name, tenant);
    return tenant;
  }
}

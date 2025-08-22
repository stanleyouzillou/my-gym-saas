import { PrismaClient } from '@prisma/client';
import { IMemberRepository } from '../../../application/ports/MemberRepo';
import { Member } from '../../../domain/entities/Member';
import { Email } from '../../../domain/value_objects/Email';

export class PrismaMemberRepository implements IMemberRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(member: Member): Promise<void> {
    await this.prisma.member.upsert({
      where: { email: member.email.value },
      create: {
        id: member.id || undefined,
        tenantId: member.tenantId,
        email: member.email.value,
        firstName: member.firstName,
        lastName: member.lastName,
        createdAt: member.createdAt,
        clerkUserId: member.clerkUserId,
        phone: member.phone,
        status: (member.status as any) ?? undefined,
        activatedAt: member.activatedAt ?? undefined,
      },
      update: {
        tenantId: member.tenantId,
        firstName: member.firstName,
        lastName: member.lastName,
        clerkUserId: member.clerkUserId,
        phone: member.phone,
        status: (member.status as any) ?? undefined,
        activatedAt: member.activatedAt ?? undefined,
      },
    });
  }

  async findByEmail(email: Email): Promise<Member | null> {
    const row = await this.prisma.member.findUnique({ where: { email: email.value } });
    if (!row) return null;
    return mapRow(row);
  }

  async findByTenant(tenantId: string): Promise<Member[]> {
    const rows = await this.prisma.member.findMany({ where: { tenantId } });
    return rows.map(mapRow);
  }
}

function mapRow(row: any): Member {
  return Member.create({
    id: row.id,
    tenantId: row.tenantId,
    email: Email.create(row.email),
    firstName: row.firstName,
    lastName: row.lastName,
    createdAt: new Date(row.createdAt),
    clerkUserId: row.clerkUserId ?? undefined,
    phone: row.phone ?? undefined,
    status: row.status ?? undefined,
    activatedAt: row.activatedAt ? new Date(row.activatedAt) : null,
  });
}

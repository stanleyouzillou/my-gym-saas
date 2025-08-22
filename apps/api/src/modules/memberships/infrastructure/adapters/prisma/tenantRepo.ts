import { PrismaClient } from '@prisma/client';
import { ITenantRepository } from '../../../application/ports/TenantRepo';
import { Tenant } from '../../../domain/entities/Tenant';

export class PrismaTenantRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByName(name: string): Promise<Tenant | null> {
    const row = await this.prisma.tenant.findFirst({ where: { name } });
    return row ? mapRow(row) : null;
  }

  async create(name: string): Promise<Tenant> {
    const row = await this.prisma.tenant.create({ data: { name } });
    return mapRow(row);
  }
}

function mapRow(row: any): Tenant {
  return Tenant.create({ id: row.id, name: row.name, createdAt: new Date(row.createdAt) });
}

import { PrismaClient } from '@prisma/client';
import { PrismaTenantRepository } from './tenantRepo';

// Integration tests for PrismaTenantRepository contract
const hasDb = !!process.env.DATABASE_URL;

(hasDb ? describe : describe.skip)('PrismaTenantRepository (integration)', () => {
  let prisma: PrismaClient;
  let tenants: PrismaTenantRepository;
  const unique = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const tenantName = `Tenant_${unique}`;

  beforeAll(() => {
    prisma = new PrismaClient();
    tenants = new PrismaTenantRepository(prisma);
  });

  afterAll(async () => {
    await prisma.tenant.deleteMany({ where: { name: tenantName } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('creates and finds by name', async () => {
    const created = await tenants.create(tenantName);
    expect(created.id).toBeTruthy();
    expect(created.name).toBe(tenantName);

    const found = await tenants.findByName(tenantName);
    expect(found).toBeTruthy();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe(tenantName);
  });
});

import { PrismaClient } from '@prisma/client';
import { PrismaMemberRepository } from './memberRepo';
import { PrismaTenantRepository } from './tenantRepo';
import { Email } from '../../../domain/value_objects/Email';
import { Member } from '../../../domain/entities/Member';

// Integration tests for PrismaMemberRepository contract
// Requires DATABASE_URL set (handled via repo env and jest setup already)
const hasDb = !!process.env.DATABASE_URL;

(hasDb ? describe : describe.skip)('PrismaMemberRepository (integration)', () => {
  let prisma: PrismaClient;
  let members: PrismaMemberRepository;
  let tenants: PrismaTenantRepository;

  const unique = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const tenantName = `Tenant_${unique}`;

  let tenantId = '';

  beforeAll(async () => {
    prisma = new PrismaClient();
    members = new PrismaMemberRepository(prisma);
    tenants = new PrismaTenantRepository(prisma);
    const t = await tenants.create(tenantName);
    tenantId = t.id;
  });

  afterAll(async () => {
    // best-effort cleanup
    await prisma.member.deleteMany({ where: { tenantId } }).catch(() => {});
    await prisma.tenant.deleteMany({ where: { id: tenantId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('saves and finds by email', async () => {
    const email = Email.create(`${unique}@example.com`);
    const m = Member.create({
      id: '',
      tenantId,
      email,
      firstName: 'First',
      lastName: 'Last',
      createdAt: new Date(),
    });

    await members.save(m);

    const found = await members.findByEmail(email);
    expect(found).toBeTruthy();
    expect(found?.email.value).toBe(email.value);
    expect(found?.tenantId).toBe(tenantId);
  });

  it('finds by tenant', async () => {
    const email2 = Email.create(`${unique}+2@example.com`);
    const m2 = Member.create({
      id: '',
      tenantId,
      email: email2,
      firstName: 'F2',
      lastName: 'L2',
      createdAt: new Date(),
    });
    await members.save(m2);

    const list = await members.findByTenant(tenantId);
    const emails = list.map((x) => x.email.value);
    expect(emails).toEqual(expect.arrayContaining([email2.value]));
  });
});

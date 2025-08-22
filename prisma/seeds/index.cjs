// Extensible Prisma seed script (CommonJS) - idempotent
// Usage: pnpm exec prisma db seed

const { PrismaClient } = require('@prisma/client');

/** Registry of seed tasks. Append new seeders here in order. */
const seeders = [seedTenantDefault, seedProgramYogaBasics];

const prisma = new PrismaClient();

async function main() {
  for (const seeder of seeders) {
    const name = seeder.name || 'anonymousSeeder';
    console.log(`[seed] running: ${name}`);
    await seeder();
  }
  console.log('[seed] completed');
}

// Seeder: ensure a default tenant exists
async function seedTenantDefault() {
  const name = 'DefaultFranchise';
  // Find existing by name (no unique constraint on name; using findFirst)
  let tenant = await prisma.tenant.findFirst({ where: { name } });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name } });
    console.log(`[seed] created Tenant ${tenant.id} (${name})`);
  } else {
    console.log(`[seed] Tenant exists ${tenant.id} (${name})`);
  }
}

// Seeder: ensure a default program exists under DefaultFranchise
async function seedProgramYogaBasics() {
  const tenant = await prisma.tenant.findFirst({ where: { name: 'DefaultFranchise' } });
  if (!tenant) {
    console.warn('[seed] skipping Program seeding: DefaultFranchise tenant not found');
    return;
  }
  const name = 'Yoga Basics';
  const existing = await prisma.program.findFirst({ where: { tenantId: tenant.id, name } });
  if (!existing) {
    const created = await prisma.program.create({ data: { tenantId: tenant.id, name } });
    console.log(`[seed] created Program ${created.id} (${name}) for tenant ${tenant.id}`);
  } else {
    console.log(`[seed] Program exists ${existing.id} (${name}) for tenant ${tenant.id}`);
  }
}

main()
  .catch((e) => {
    console.error('[seed] error', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

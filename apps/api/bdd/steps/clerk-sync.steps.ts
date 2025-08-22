import { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import path from 'path';
import dotenv from 'dotenv';
// Load root .env explicitly (apps/api/bdd/steps -> ../../../../.env)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpErrorFilter } from '../../src/shared/presentation/filters/http-error.filter';
import { PrismaClient } from '@prisma/client';

setDefaultTimeout(30_000);

let app: INestApplication;
let prisma: PrismaClient;

// Shared context for steps
type SyncContext = {
  email?: string;
  role?: 'member' | 'franchise_admin' | 'coach';
  tenantName?: string;
  firstName?: string;
  lastName?: string;
};
const ctx: SyncContext = {};

BeforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());
  await app.init();

  prisma = new PrismaClient();
});

AfterAll(async () => {
  if (app) await app.close();
  if (prisma) await prisma.$disconnect();
});

Given('a fresh system', async function () {
  // For DB-backed tests we do not reset the DB here to avoid destructive operations.
  // Tests are written to be idempotent using upsert-like behavior.
});

Given(
  'a Clerk user exists with email {string} and role {string} for tenant {string}',
  function (email: string, role: string, tenantName: string) {
    ctx.email = email;
    ctx.role = role as any;
    ctx.tenantName = tenantName;
    ctx.firstName = email.split('@')[0];
    ctx.lastName = 'User';
  },
);

When('the system processes the Clerk user sync', async function () {
  if (!ctx.email || !ctx.role || !ctx.tenantName) throw new Error('Missing context for sync');
  const res = await request(app.getHttpServer())
    .post('/api/memberships/sync-user')
    .set('Content-Type', 'application/json')
    .send({
      email: ctx.email,
      firstName: ctx.firstName,
      lastName: ctx.lastName,
      role: ctx.role,
      tenantName: ctx.tenantName,
    });
  if (res.status >= 400) {
    throw new Error(`Sync failed with ${res.status}: ${JSON.stringify(res.body)}`);
  }
});

Then('a Tenant named {string} exists', async function (tenantName: string) {
  const t = await prisma.tenant.findFirst({ where: { name: tenantName } });
  if (!t) throw new Error(`Expected tenant ${tenantName} to exist`);
});

Then('a Member exists with email {string} under tenant {string}', async function (email: string, tenantName: string) {
  const t = await prisma.tenant.findFirst({ where: { name: tenantName } });
  if (!t) throw new Error(`Tenant ${tenantName} not found`);
  const m = await prisma.member.findFirst({ where: { email, tenantId: t.id } });
  if (!m) throw new Error(`Expected member ${email} under tenant ${tenantName}`);
});

Then('no Member is created for {string}', async function (email: string) {
  const m = await prisma.member.findFirst({ where: { email } });
  if (m) throw new Error(`Did not expect member ${email} to exist`);
});

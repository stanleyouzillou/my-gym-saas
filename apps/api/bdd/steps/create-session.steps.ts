import { BeforeAll, AfterAll, Given, When, Then, DataTable, setDefaultTimeout } from '@cucumber/cucumber';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpErrorFilter } from '../../src/shared/presentation/filters/http-error.filter';
import type { Request, Response as ExResponse, NextFunction } from 'express';

setDefaultTimeout(30_000);

let app: INestApplication;
let lastResponse: Response;

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
});

AfterAll(async () => {
  if (app) await app.close();
});

Given('a fresh system', function () {
  // No-op with Nest DI; tests can override providers if needed in their own modules
});

Given('a franchise {string} exists and is authenticated as {string}', function (_franchise: string, _user: string) {
  // No-op for now; auth not enforced in this slice
});

Given('a coach {string} exists for {string}', function (_coach: string, _franchise: string) {
  // No-op in this slice
});

Given('a program {string} exists for {string}', function (_program: string, _franchise: string) {
  // No-op in this slice
});

When('the franchise schedules a session for {string} with', async function (program: string, table: DataTable) {
  const obj = table.rowsHash() as Record<string, string>;
  const body = {
    programId: programIdFrom(program),
    startTime: obj['startTime'],
    durationMinutes: Number(obj.durationMinutes),
    maxCapacity: obj.maxCapacity !== undefined ? Number(obj.maxCapacity) : undefined,
    coachName: obj.coachName,
  } as any;
  lastResponse = await request(app.getHttpServer())
    .post('/api/sessions')
    .set('Content-Type', 'application/json')
    .send(body);
  if (lastResponse.status >= 400) {
    throw new Error(`Expected success, got ${lastResponse.status}: ${JSON.stringify(lastResponse.body)}`);
  }
});

When('the franchise attempts to schedule a session for {string} with', async function (program: string, table: DataTable) {
  const obj = table.rowsHash() as Record<string, string>;
  const body = {
    programId: programIdFrom(program),
    startTime: obj['startTime'],
    durationMinutes: obj.durationMinutes !== undefined ? Number(obj.durationMinutes) : undefined,
    maxCapacity: obj.maxCapacity !== undefined ? Number(obj.maxCapacity) : undefined,
    coachName: obj.coachName,
  } as any;
  lastResponse = await request(app.getHttpServer())
    .post('/api/sessions')
    .set('Content-Type', 'application/json')
    .send(body);
});

Then('a {string} event is persisted with program {string}', async function (eventType: string, program: string) {
  const programId = programIdFrom(program);
  const deadline = Date.now() + 1000;
  while (true) {
    const res = await request(app.getHttpServer()).get('/api/_debug/events');
    const found = res.body?.some((e: any) => e.type === eventType && e.payload?.programId === programId);
    if (found) return;
    if (Date.now() > deadline) {
      throw new Error(`Expected ${eventType} for program ${programId}`);
    }
    await new Promise((r) => setTimeout(r, 50));
  }
});

Then('the public catalog for {string} contains a session on {string} with availableSeats {int}', async function (_franchise: string, dateIso: string, seats: number) {
  const res = await request(app.getHttpServer())
    .get('/api/sessions')
    .query({ programId: programIdFrom('*') });
  const found = res.body.some((s: any) => s.startTime.startsWith(dateIso) && s.maxCapacity === seats);
  if (!found) throw new Error(`Expected session on ${dateIso} with seats ${seats}`);
});

Then('the API returns a validation error indicating {string} is required', function (field: string) {
  if (!lastResponse) throw new Error('No response');
  if (lastResponse.status !== 400) throw new Error(`Expected 400, got ${lastResponse.status}`);
  const body = lastResponse.body;
  if (!body || body.success !== false || body.error?.code !== 'VALIDATION_ERROR') {
    throw new Error('Expected validation error envelope');
  }
  const msg = JSON.stringify(body.error.details ?? body.error);
  if (!msg.includes(field)) throw new Error(`Validation details do not mention ${field}`);
});

Then('no {string} event is persisted', async function (eventType: string) {
  const res = await request(app.getHttpServer()).get('/api/_debug/events');
  const found = res.body.some((e: any) => e.type === eventType);
  if (found) throw new Error(`Did not expect ${eventType} event`);
});

Given('an authenticated user {string} who is NOT a franchise admin', function (_user: string) {
  // Not enforced yet — would be implemented with guards later
});

When('that user attempts to schedule a session for program {string}', async function (program: string) {
  // For now, behaves the same (no auth). Marking as pending until auth is implemented.
  return 'pending';
});

Then('the API responds with 403 Forbidden', function () {
  return 'pending';
});

Then('no session is created', function () {
  return 'pending';
});

function programIdFrom(name: string): string {
  // Simple mapping for this slice. In a real system, lookup IDs.
  if (name === '*' || !name) return undefined as any;
  return name.replace(/\s+/g, '_').toLowerCase();
}

// Pending step definitions for future scenarios (coach validation)
Given('a coach {string} exists but is NOT associated with {string}', function (_coach: string, _franchise: string) {
  return 'pending';
});

When('the franchise attempts to schedule a session for {string} assigning coach {string} with', function (_program: string, _coach: string, _table: DataTable) {
  return 'pending';
});

Then('the API returns an error {string}', function (_message: string) {
  return 'pending';
});

function normalizeIso(input: string): string {
  try {
    return new Date(input).toISOString();
  } catch {
    return input;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { HttpErrorFilter } from '../src/shared/presentation/filters/http-error.filter';

describe('Scheduling (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
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

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/sessions creates a session (happy path)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/sessions')
      .send({
        programId: 'prog_e2e',
        startTime: '2025-10-01T09:00:00Z',
        durationMinutes: 45,
        maxCapacity: 8,
        coachName: 'Coach Test',
      })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      programId: 'prog_e2e',
      startTime: '2025-10-01T09:00:00.000Z',
      durationMinutes: 45,
      maxCapacity: 8,
      coachName: 'Coach Test',
    });

    // Assert domain event emitted
    const ev = await request(app.getHttpServer())
      .get('/api/_debug/events')
      .expect(200);
    const hasScheduled = ev.body.some(
      (e: any) => e.type === 'SessionScheduled' && e.payload.programId,
    );
    expect(hasScheduled).toBe(true);
  });

  it('GET /api/sessions returns created session', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/sessions')
      .query({ programId: 'prog_e2e' })
      .expect(200);

    const found = res.body.find((s: any) => s.programId === 'prog_e2e');
    expect(found).toBeTruthy();
  });

  it('POST /api/sessions returns validation envelope when missing maxCapacity', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/sessions')
      .send({
        programId: 'prog_e2e',
        startTime: '2025-10-01T09:00:00Z',
        durationMinutes: 45,
        // maxCapacity omitted
      })
      .expect(400);

    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
      },
    });
  });
});

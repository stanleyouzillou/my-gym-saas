import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/shared/presentation/filters/http-error.filter';
import * as bodyParser from 'body-parser';
import { Webhook } from 'svix';

describe('Clerk Webhook (e2e) - signature verification', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Use a deterministic, valid-looking Clerk/Svix secret for tests.
    // Svix expects a base64 segment after the 'whsec_' prefix.
    const base64 = Buffer.from('test-secret').toString('base64');
    process.env.CLERK_WEBHOOK_SECRET = `whsec_${base64}`;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.use('/api/webhooks/clerk', bodyParser.raw({ type: '*/*' }));
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
    await app?.close();
  });

  it('rejects invalid signatures with 401', async () => {
    const payload = {
      data: {
        email_addresses: [{ email_address: 'x@example.com' }],
        public_metadata: {},
      },
    };
    const res = await request(app.getHttpServer())
      .post('/api/webhooks/clerk')
      .set('Content-Type', 'application/json')
      // Intentionally missing/invalid Svix headers
      .set('svix-id', 'id_123')
      .set('svix-timestamp', String(Math.floor(Date.now() / 1000)))
      .set('svix-signature', 'v1,invalid')
      .send(JSON.stringify(payload));

    expect(res.status).toBe(401);
  });

  it('accepts valid signature with 200', async () => {
    const payload = {
      data: {
        email_addresses: [{ email_address: 'valid@example.com' }],
        first_name: 'Valid',
        last_name: 'User',
        public_metadata: { role: 'member', tenantName: 'DefaultFranchise' },
      },
    };
    const body = JSON.stringify(payload);
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    // Svix helper to produce canonical webhook headers for a payload
    const headers = (wh as any).generateHeaders
      ? ((wh as any).generateHeaders(body) as Record<string, string>)
      : ({
          // Fallback: if generateHeaders is unavailable in this version, use known keys with placeholders
          // (the endpoint verifies via the same secret, so signed headers are required; our installed version should expose generateHeaders)
          'svix-id': 'test_id',
          'svix-timestamp': String(Math.floor(Date.now() / 1000)),
          'svix-signature': '',
        } as Record<string, string>);

    const res = await request(app.getHttpServer())
      .post('/api/webhooks/clerk')
      .set('Content-Type', 'application/json')
      .set('svix-id', headers['svix-id'])
      .set('svix-timestamp', headers['svix-timestamp'])
      .set('svix-signature', headers['svix-signature'])
      .send(body);

    expect(res.status).toBe(200);
  });
});

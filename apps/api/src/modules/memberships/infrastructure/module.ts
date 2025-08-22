import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMemberRepository } from './adapters/prisma/memberRepo';
import { PrismaTenantRepository } from './adapters/prisma/tenantRepo';
import {
  IMemberRepositoryToken,
  ITenantRepositoryToken,
  SyncUserUseCaseToken,
  ClerkWebhookVerifierToken,
} from '../application/tokens';
import { SyncUserUseCase } from '../application/use_cases/syncUser';
import { ClerkWebhookController } from '../presentation/controllers/clerkWebhook.controller';
import { SvixWebhookVerifier } from './providers/svixWebhook';
import { FakeSignupController } from '../presentation/controllers/signup.controller';

export const PRISMA_CLIENT = 'PRISMA_CLIENT_MEMBERSHIPS';

@Module({
  controllers: [ClerkWebhookController, FakeSignupController],
  providers: [
    {
      provide: PRISMA_CLIENT,
      useFactory: async () => {
        const client = new PrismaClient();
        await client.$connect();
        return client;
      },
    },
    {
      provide: IMemberRepositoryToken,
      useFactory: (prisma: PrismaClient) => new PrismaMemberRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: ITenantRepositoryToken,
      useFactory: (prisma: PrismaClient) => new PrismaTenantRepository(prisma),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: SyncUserUseCaseToken,
      useFactory: (tenantRepo: any, memberRepo: any) =>
        new SyncUserUseCase(tenantRepo, memberRepo),
      inject: [ITenantRepositoryToken, IMemberRepositoryToken],
    },
    {
      provide: ClerkWebhookVerifierToken,
      useClass: SvixWebhookVerifier,
    },
  ],
  exports: [
    IMemberRepositoryToken,
    ITenantRepositoryToken,
    SyncUserUseCaseToken,
    PRISMA_CLIENT,
    ClerkWebhookVerifierToken,
  ],
})
export class MembershipsModule {}

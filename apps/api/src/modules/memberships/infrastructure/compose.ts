import { PrismaClient } from '@prisma/client';
import { PrismaMemberRepository } from './adapters/prisma/memberRepo';
import type { IMemberRepository } from '../application/ports/MemberRepo';
import type { ITenantRepository } from '../application/ports/TenantRepo';
import { PrismaTenantRepository } from './adapters/prisma/tenantRepo';
import { SyncUserUseCase } from '../application/use_cases/syncUser';

export type MembershipsDeps = {
  memberRepo: IMemberRepository;
  tenantRepo: ITenantRepository;
  syncUser: SyncUserUseCase;
};

let prisma: PrismaClient | null = null;
let singleton: MembershipsDeps | null = null;

export function getMembershipsDeps(): MembershipsDeps {
  if (!singleton) {
    if (!prisma) {
      prisma = new PrismaClient();
    }
    const memberRepo = new PrismaMemberRepository(prisma);
    const tenantRepo = new PrismaTenantRepository(prisma);
    const syncUser = new SyncUserUseCase(tenantRepo, memberRepo);
    singleton = { memberRepo, tenantRepo, syncUser };
  }
  return singleton;
}

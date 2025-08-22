import { PrismaMemberRepository } from './adapters/prisma/memberRepo';
import { getPrisma } from './providers/db/prismaClient';
import type { IMemberRepository } from '../application/ports/MemberRepo';
import type { ITenantRepository } from '../application/ports/TenantRepo';
import { PrismaTenantRepository } from './adapters/prisma/tenantRepo';
import { SyncUserUseCase } from '../application/use_cases/syncUser';

export type MembershipsDeps = {
  memberRepo: IMemberRepository;
  tenantRepo: ITenantRepository;
  syncUser: SyncUserUseCase;
};

let singleton: MembershipsDeps | null = null;

export function getMembershipsDeps(): MembershipsDeps {
  if (!singleton) {
    // For now we only support Prisma for Memberships per request
    const prisma = getPrisma();
    const memberRepo = new PrismaMemberRepository(prisma);
    const tenantRepo = new PrismaTenantRepository(prisma);
    const syncUser = new SyncUserUseCase(tenantRepo, memberRepo);
    singleton = { memberRepo, tenantRepo, syncUser };
  }
  return singleton;
}

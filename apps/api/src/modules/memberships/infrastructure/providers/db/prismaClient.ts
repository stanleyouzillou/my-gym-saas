import { PrismaClient } from '@prisma/client';

// Singleton Prisma client for the Memberships bounded context
let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

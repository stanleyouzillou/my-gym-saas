/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."MemberStatus" AS ENUM ('PENDING', 'ACTIVE');

-- AlterTable
ALTER TABLE "public"."Member" ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "clerkUserId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "public"."MemberStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Member_clerkUserId_key" ON "public"."Member"("clerkUserId");

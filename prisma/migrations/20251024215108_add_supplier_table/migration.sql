/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `clerkid` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cities" DROP CONSTRAINT "cities_clerkId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_clerkId_fkey";

-- DropConstraint
ALTER TABLE "public"."users" DROP CONSTRAINT "users_clerkId_key";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerkId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "clerkid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_clerkId_key" ON "suppliers"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "suppliers"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "suppliers"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

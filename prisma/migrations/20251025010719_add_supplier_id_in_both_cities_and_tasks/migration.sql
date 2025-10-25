/*
  Warnings:

  - You are about to drop the column `clerkId` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `supplierId` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cities" DROP CONSTRAINT "cities_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_id_fkey";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "clerkId",
ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "clerkId",
ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

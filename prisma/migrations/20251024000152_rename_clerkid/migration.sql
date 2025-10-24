/*
  Warnings:

  - You are about to drop the column `supplierid` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `supplierid` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `clerkId` on table `cities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clerkId` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clerkId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."cities" DROP CONSTRAINT "cities_supplierid_fkey";

-- DropForeignKey
ALTER TABLE "public"."suppliers" DROP CONSTRAINT "suppliers_userid_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_supplierid_fkey";

-- DropIndex
DROP INDEX "public"."cities_userid_supplierid_idx";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "supplierid",
DROP COLUMN "userid",
ALTER COLUMN "clerkId" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "supplierid",
DROP COLUMN "userid",
ALTER COLUMN "clerkId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "clerkId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."suppliers";

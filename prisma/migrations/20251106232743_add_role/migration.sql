/*
  Warnings:

  - You are about to drop the column `clerkid` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."users_clerkid_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerkid",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';

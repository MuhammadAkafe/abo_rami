/*
  Warnings:

  - A unique constraint covering the columns `[clerkid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."cities" DROP CONSTRAINT "cities_clerkId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_clerkId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkid_key" ON "users"("clerkid");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_id_fkey" FOREIGN KEY ("id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_id_fkey" FOREIGN KEY ("id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

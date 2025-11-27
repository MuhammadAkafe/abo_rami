/*
  Warnings:

  - Added the required column `userId` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add the column as nullable first
ALTER TABLE "suppliers" ADD COLUMN "userId" INTEGER;

-- Step 2: Update existing suppliers to point to the first admin user
UPDATE "suppliers" 
SET "userId" = (SELECT "id" FROM "users" WHERE "role" = 'ADMIN' LIMIT 1)
WHERE "userId" IS NULL;

-- Step 2b: If no admin exists, use the first user
UPDATE "suppliers" 
SET "userId" = (SELECT "id" FROM "users" ORDER BY "id" LIMIT 1)
WHERE "userId" IS NULL;

-- Step 2c: If no users exist at all, delete existing suppliers (assuming they're test data)
DELETE FROM "suppliers" WHERE "userId" IS NULL;

-- Step 3: Now make it NOT NULL (this will only work if all rows have userId set)
ALTER TABLE "suppliers" ALTER COLUMN "userId" SET NOT NULL;

-- Step 4: Add the foreign key constraint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

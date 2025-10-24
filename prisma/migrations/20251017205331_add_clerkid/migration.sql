-- Add clerkId column to users table
ALTER TABLE "users" ADD COLUMN "clerkId" TEXT;

-- Add clerkId column to tasks table  
ALTER TABLE "tasks" ADD COLUMN "clerkId" TEXT;

-- Add clerkId column to cities table
ALTER TABLE "cities" ADD COLUMN "clerkId" TEXT;

-- Make clerkId unique in users table
ALTER TABLE "users" ADD CONSTRAINT "users_clerkId_key" UNIQUE ("clerkId");

-- Add foreign key constraints
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cities" ADD CONSTRAINT "cities_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

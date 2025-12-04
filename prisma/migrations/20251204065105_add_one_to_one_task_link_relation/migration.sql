-- CreateTable
CREATE TABLE "link" (
    "id" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "link_taskId_key" ON "link"("taskId");

-- AddForeignKey
ALTER TABLE "link" ADD CONSTRAINT "link_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

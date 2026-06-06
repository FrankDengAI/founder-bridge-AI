-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "matchIntent" TEXT NOT NULL DEFAULT 'PARTNER';

-- CreateTable
CREATE TABLE IF NOT EXISTS "BountyRequest" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "keywords" TEXT NOT NULL DEFAULT '[]',
    "budgetLabel" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BountyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BountyRequest_status_createdAt_idx" ON "BountyRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BountyRequest_authorId_idx" ON "BountyRequest"("authorId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "BountyRequest" ADD CONSTRAINT "BountyRequest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

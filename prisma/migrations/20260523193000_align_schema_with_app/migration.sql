-- Align the deployed database with the current Prisma schema.
-- This migration is additive so it can run safely after the original init migration.

-- UserProfile additions
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "remoteOk" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "githubUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);

-- Post additions used by publishing, drafts, and model discussions
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'published';
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "meta" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "linkedProjectId" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "linkedToolId" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "linkedModelId" TEXT;

-- Project additions used by detail pages and seed data
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "coverUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "teamNeeds" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "stage" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "tags" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "revenueBand" TEXT NOT NULL DEFAULT '';

-- Tool review moderation/demo reply field
ALTER TABLE "ToolReview" ADD COLUMN IF NOT EXISTS "authorReply" TEXT NOT NULL DEFAULT '';

-- Templates
CREATE TABLE IF NOT EXISTS "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "stack" TEXT NOT NULL DEFAULT '[]',
    "downloadUrl" TEXT NOT NULL DEFAULT '',
    "copyCmd" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- AI model rating community
CREATE TABLE IF NOT EXISTS "AiModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "strengths" TEXT NOT NULL DEFAULT '[]',
    "scenarios" TEXT NOT NULL DEFAULT '[]',
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "rankScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiModel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AiModelReview" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "pros" TEXT NOT NULL DEFAULT '',
    "cons" TEXT NOT NULL DEFAULT '',
    "scenario" TEXT NOT NULL DEFAULT '',
    "comment" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiModelReview_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "Post_status_createdAt_idx" ON "Post"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Post_type_idx" ON "Post"("type");
CREATE INDEX IF NOT EXISTS "Post_linkedModelId_idx" ON "Post"("linkedModelId");
CREATE INDEX IF NOT EXISTS "AiModel_rankScore_idx" ON "AiModel"("rankScore");
CREATE INDEX IF NOT EXISTS "AiModel_avgRating_idx" ON "AiModel"("avgRating");
CREATE INDEX IF NOT EXISTS "AiModelReview_modelId_createdAt_idx" ON "AiModelReview"("modelId", "createdAt");

-- Foreign keys that cannot use IF NOT EXISTS directly.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Post_linkedModelId_fkey'
  ) THEN
    ALTER TABLE "Post"
      ADD CONSTRAINT "Post_linkedModelId_fkey"
      FOREIGN KEY ("linkedModelId") REFERENCES "AiModel"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AiModelReview_modelId_fkey'
  ) THEN
    ALTER TABLE "AiModelReview"
      ADD CONSTRAINT "AiModelReview_modelId_fkey"
      FOREIGN KEY ("modelId") REFERENCES "AiModel"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

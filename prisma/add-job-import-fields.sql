DO $$
BEGIN
  CREATE TYPE "JobReviewStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceName" TEXT,
  ADD COLUMN IF NOT EXISTS "reviewStatus" "JobReviewStatus"
    NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN IF NOT EXISTS "importedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Job_sourceUrl_key"
  ON "Job" ("sourceUrl");

CREATE INDEX IF NOT EXISTS "Job_reviewStatus_closingDate_idx"
  ON "Job" ("reviewStatus", "closingDate");
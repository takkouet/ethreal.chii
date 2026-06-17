-- Add accessToken. Backfill existing rows with a DB-generated random value,
-- then keep a DB-level default so the column is always populated.
ALTER TABLE "Order"
  ADD COLUMN "accessToken" TEXT NOT NULL DEFAULT gen_random_uuid()::text;

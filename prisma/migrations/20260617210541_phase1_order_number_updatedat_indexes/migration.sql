-- Product: index on active (storefront filters on active=true).
CREATE INDEX "Product_active_idx" ON "Product"("active");

-- Order.orderNumber: human-friendly unique code (CHII-XXXXXX). DB default
-- backfills existing rows and populates new ones; Prisma sees @default(dbgenerated()).
ALTER TABLE "Order"
  ADD COLUMN "orderNumber" TEXT NOT NULL
  DEFAULT ('CHII-' || upper(substr(md5(gen_random_uuid()::text), 1, 6)));

CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- Order.updatedAt: @updatedAt. Backfill existing rows with createdAt, default now()
-- so the NOT NULL column is always populated; Prisma manages it on writes.
ALTER TABLE "Order"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "Order" SET "updatedAt" = "createdAt";

-- Order: index on createdAt (admin lists order by createdAt desc).
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

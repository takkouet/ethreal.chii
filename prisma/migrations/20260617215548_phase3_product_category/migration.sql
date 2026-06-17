-- Optional product category (character / series / type). Nullable so existing
-- rows need no backfill. Indexed for the storefront category filter.
ALTER TABLE "Product" ADD COLUMN "category" TEXT;
CREATE INDEX "Product_category_idx" ON "Product"("category");

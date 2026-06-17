-- Idempotency keys for checkout: maps a client-supplied key to the order it
-- created, so a duplicate submit (double-click, retry) returns the same order
-- instead of creating a second one.
CREATE TABLE "IdempotencyKey" (
    "key" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("key")
);

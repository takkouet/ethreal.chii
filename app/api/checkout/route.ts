import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export async function POST(req: Request) {
  // Rate limit by IP — prevents checkout spam / fake-order flooding.
  if (!rateLimit(`checkout:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  // Idempotency: a duplicate submit with the same key returns the original
  // order instead of creating a second one (double-click, network retry).
  const idemKey = req.headers.get("idempotency-key")?.slice(0, 200) || null;
  if (idemKey) {
    const existing = await prisma.idempotencyKey.findUnique({
      where: { key: idemKey },
    });
    if (existing) {
      return NextResponse.json({
        orderId: existing.orderId,
        token: existing.accessToken,
      });
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Re-read products from DB — never trust client prices.
  const ids = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const orderItems: {
    productId: string;
    productName: string;
    priceVnd: number;
    quantity: number;
  }[] = [];
  for (const item of input.items) {
    const product = byId.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product unavailable: ${item.productId}` },
        { status: 409 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Not enough stock for ${product.name}` },
        { status: 409 }
      );
    }
    orderItems.push({
      productId: product.id,
      productName: product.name,
      priceVnd: product.priceVnd,
      quantity: item.quantity,
    });
  }

  const totalVnd = orderItems.reduce(
    (sum, i) => sum + i.priceVnd * i.quantity,
    0
  );

  const accessToken = randomBytes(24).toString("hex");

  // Create order + decrement stock atomically. Stock is guarded INSIDE the
  // transaction with a conditional update so concurrent checkouts cannot
  // oversell: updateMany only matches rows that still have enough stock.
  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const i of orderItems) {
        const res = await tx.product.updateMany({
          where: { id: i.productId, active: true, stock: { gte: i.quantity } },
          data: { stock: { decrement: i.quantity } },
        });
        if (res.count === 0) {
          throw new OutOfStockError(i.productName);
        }
      }
      const created = await tx.order.create({
        data: {
          customerName: input.customerName,
          phone: input.phone,
          email: input.email || null,
          address: input.address,
          note: input.note || null,
          paymentMethod: input.paymentMethod,
          totalVnd,
          accessToken,
          items: { create: orderItems },
        },
      });

      // Record the idempotency key in the SAME transaction. If a concurrent
      // request already created an order for this key, the unique PK conflicts
      // and the whole txn rolls back (stock decrement included) — no oversell,
      // no duplicate order.
      if (idemKey) {
        await tx.idempotencyKey.create({
          data: { key: idemKey, orderId: created.id, accessToken },
        });
      }

      return created;
    });

    return NextResponse.json({ orderId: order.id, token: accessToken });
  } catch (e) {
    if (e instanceof OutOfStockError) {
      return NextResponse.json(
        { error: `Not enough stock for ${e.productName}` },
        { status: 409 }
      );
    }
    // Concurrent duplicate with same idempotency key: the loser rolled back.
    // Return the order the winner created.
    if (
      idemKey &&
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const existing = await prisma.idempotencyKey.findUnique({
        where: { key: idemKey },
      });
      if (existing) {
        return NextResponse.json({
          orderId: existing.orderId,
          token: existing.accessToken,
        });
      }
    }
    console.error("Checkout failed:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

class OutOfStockError extends Error {
  constructor(public productName: string) {
    super("OUT_OF_STOCK");
  }
}

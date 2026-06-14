import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation";

export async function POST(req: Request) {
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

  // Create order + decrement stock atomically.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        note: input.note || null,
        paymentMethod: input.paymentMethod,
        totalVnd,
        items: { create: orderItems },
      },
    });
    for (const i of orderItems) {
      await tx.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.quantity } },
      });
    }
    return created;
  });

  return NextResponse.json({ orderId: order.id });
}

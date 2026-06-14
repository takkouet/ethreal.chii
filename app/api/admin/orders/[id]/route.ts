import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !STATUSES.includes(body.status as never)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const nextStatus = body.status as (typeof STATUSES)[number];

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!existing) throw new Error("NOT_FOUND");

      // Cancelling an order that wasn't already cancelled → return stock.
      if (nextStatus === "CANCELLED" && existing.status !== "CANCELLED") {
        for (const item of existing.items) {
          await tx.product.updateMany({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: nextStatus },
      });
    });
    return NextResponse.json(order);
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


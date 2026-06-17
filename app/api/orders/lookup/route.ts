import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

// Look up an order by its human number + a matching contact (phone or email).
// Returns the order id + access token so the client can open the full order
// page. Rate-limited to deter enumeration of order numbers.
export async function POST(req: Request) {
  if (!rateLimit(`lookup:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please slow down." },
      { status: 429 }
    );
  }

  let body: { orderNumber?: string; contact?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderNumber = (body.orderNumber ?? "").trim().toUpperCase();
  const contact = (body.contact ?? "").trim();
  if (!orderNumber || !contact) {
    return NextResponse.json(
      { error: "Order number and phone/email are required" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, accessToken: true, phone: true, email: true },
  });

  // Same generic response whether the number is wrong or the contact mismatches,
  // so an attacker can't tell which part was right.
  const matches =
    order &&
    (order.phone === contact ||
      (order.email && order.email.toLowerCase() === contact.toLowerCase()));

  if (!order || !matches) {
    return NextResponse.json(
      { error: "No order found matching those details." },
      { status: 404 }
    );
  }

  return NextResponse.json({ orderId: order.id, token: order.accessToken });
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { AdminNav } from "@/components/admin-nav";
import { OrderStatusControl } from "@/components/order-status-control";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <>
      <AdminNav />
      <Link
        href="/admin"
        className="text-muted hover:text-coral transition-colors duration-200 cursor-pointer"
      >
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Order{" "}
          <span className="font-mono text-xl text-muted">
            {order.id.slice(0, 8)}
          </span>
        </h1>
        <OrderStatusControl
          orderId={order.id}
          current={order.status as OrderStatus}
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold">Customer & shipping</h2>
          <dl className="mt-4 text-sm flex flex-col gap-2">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="font-medium">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="font-medium">{order.phone}</dd>
            </div>
            {order.email && (
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium">{order.email}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Address</dt>
              <dd className="font-medium whitespace-pre-line">
                {order.address}
              </dd>
            </div>
            {order.note && (
              <div>
                <dt className="text-muted">Note</dt>
                <dd className="font-medium">{order.note}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Payment method</dt>
              <dd className="font-medium">{order.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-muted">Placed</dt>
              <dd className="font-medium">
                {order.createdAt.toLocaleString("vi-VN")}
              </dd>
            </div>
          </dl>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-xl font-bold">Items</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="text-muted">
                  {i.productName} × {i.quantity}
                </span>
                <span>{formatVnd(i.priceVnd * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg">
            <span>Total</span>
            <span className="font-bold text-ink">
              {formatVnd(order.totalVnd)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME || "Your Bank",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT || "0000000000",
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER || "CHIIKAWA SHOP",
  qrImage: process.env.NEXT_PUBLIC_VIETQR_IMAGE || "/vietqr.svg",
};

export default async function OrderConfirmationPage({
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
    <Reveal as="section" className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-8 w-8 text-coral" aria-hidden="true" />
        <h1 className="text-3xl sm:text-4xl font-bold">
          Order placed!
        </h1>
      </div>
      <p className="mt-3 text-muted">
        Thank you, {order.customerName}. Your order ID is{" "}
        <span className="font-mono font-medium text-ink">{order.id}</span>.
      </p>

      {/* Items */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-xl font-bold">Order summary</h2>
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

      {/* Payment instructions */}
      <div className="mt-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-xl font-bold">Payment</h2>

        {order.paymentMethod === "COD" && (
          <p className="mt-3 text-muted">
            You chose <strong>Cash on delivery</strong>. Please prepare{" "}
            {formatVnd(order.totalVnd)} to pay the courier when your order
            arrives.
          </p>
        )}

        {order.paymentMethod === "BANK_QR" && (
          <div className="mt-3">
            <p className="text-muted">
              Please transfer <strong>{formatVnd(order.totalVnd)}</strong> using
              the QR below. Use your order ID{" "}
              <span className="font-mono">{order.id}</span> as the transfer note.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <Image
                src={BANK.qrImage}
                alt="VietQR bank transfer code"
                width={320}
                height={420}
                sizes="320px"
                className="h-auto w-auto max-w-xs rounded-xl border border-border"
              />
              <dl className="text-sm">
                <dt className="text-muted">Bank</dt>
                <dd className="font-medium">{BANK.name}</dd>
                <dt className="mt-2 text-muted">Account number</dt>
                <dd className="font-medium font-mono">{BANK.account}</dd>
                <dt className="mt-2 text-muted">Account holder</dt>
                <dd className="font-medium">{BANK.holder}</dd>
              </dl>
            </div>
            <p className="mt-4 text-xs text-muted">
              We will confirm your payment manually and update your order.
            </p>
          </div>
        )}

        {order.paymentMethod === "CARD_CONTACT" && (
          <p className="mt-3 text-muted">
            You chose <strong>Card payment</strong>. We will contact you at{" "}
            {order.phone}
            {order.email ? ` / ${order.email}` : ""} to arrange the card
            payment.
          </p>
        )}
      </div>

      <Link
        href="/products"
        className="mt-8 inline-flex rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
      >
        Continue shopping
      </Link>
    </Reveal>
  );
}

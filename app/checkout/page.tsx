"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { formatVnd } from "@/lib/money";
import type { PaymentMethod } from "@/lib/types";
import { Reveal } from "@/components/reveal";

const paymentOptions: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "COD", label: "Cash on delivery", hint: "Pay when you receive it." },
  {
    value: "BANK_QR",
    label: "Bank transfer (QR)",
    hint: "Scan VietQR after ordering.",
  },
  {
    value: "CARD_CONTACT",
    label: "Card",
    hint: "We'll contact you to arrange card payment.",
  },
];

export default function CheckoutPage() {
  const { items, totalVnd, clear } = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentMethod>("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      address: String(form.get("address") || ""),
      note: String(form.get("note") || ""),
      paymentMethod: payment,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed. Please try again.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>
        <p className="text-muted">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Browse goods
        </Link>
      </section>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral";

  return (
    <Reveal as="section" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Shipping + payment */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <fieldset className="rounded-2xl border border-border bg-white p-6">
            <legend className="text-xl font-bold px-2">
              Shipping information
            </legend>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="sm:col-span-2">
                <label htmlFor="customerName" className="text-sm font-medium">
                  Full name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email (optional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Full address (street, ward, district, province)
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="note" className="text-sm font-medium">
                  Note (optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-white p-6">
            <legend className="text-xl font-bold px-2">
              Payment method
            </legend>
            <div className="mt-4 flex flex-col gap-3">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors duration-200 ${
                    payment === opt.value
                      ? "border-coral bg-pink-pale"
                      : "border-border hover:bg-pink-pale"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={payment === opt.value}
                    onChange={() => setPayment(opt.value)}
                    className="mt-1 h-4 w-4 accent-coral"
                  />
                  <span>
                    <span className="block font-medium">{opt.label}</span>
                    <span className="block text-sm text-muted">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <aside className="rounded-2xl border border-border bg-pink-pale p-6 h-fit">
          <h2 className="text-xl font-bold">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="text-muted">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatVnd(i.priceVnd * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg">
            <span>Total</span>
            <span className="font-bold text-ink">
              {formatVnd(totalVnd)}
            </span>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </Reveal>
  );
}

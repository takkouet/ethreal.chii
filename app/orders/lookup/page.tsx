"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/reveal";

export default function OrderLookupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      orderNumber: String(form.get("orderNumber") || ""),
      contact: String(form.get("contact") || ""),
    };

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lookup failed. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push(`/order/${data.orderId}?t=${data.token}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral";

  return (
    <Reveal as="section" className="mx-auto max-w-md px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold">Track your order</h1>
      <p className="mt-3 text-muted">
        Enter your order number and the phone or email used at checkout.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-border bg-white p-6 flex flex-col gap-4"
      >
        <div>
          <label htmlFor="orderNumber" className="text-sm font-medium">
            Order number
          </label>
          <input
            id="orderNumber"
            name="orderNumber"
            required
            placeholder="CHII-ABC123"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact" className="text-sm font-medium">
            Phone or email
          </label>
          <input id="contact" name="contact" required className={inputClass} />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Looking up…" : "Find my order"}
        </button>
      </form>
    </Reveal>
  );
}

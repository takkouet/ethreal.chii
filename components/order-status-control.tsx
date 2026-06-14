"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

export function OrderStatusControl({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(current);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function update(next: OrderStatus) {
    setBusy(true);
    setSaved(false);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) {
      setStatus(next);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 1500);
    } else {
      alert("Update failed.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="status" className="text-sm font-medium">
        Status
      </label>
      <select
        id="status"
        value={status}
        disabled={busy}
        onChange={(e) => update(e.target.value as OrderStatus)}
        className="rounded-xl border border-border bg-white px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saved && <span className="text-sm text-ink">Saved ✓</span>}
    </div>
  );
}

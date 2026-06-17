"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./toast";
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
  const { toast } = useToast();
  const [status, setStatus] = useState<OrderStatus>(current);
  const [busy, setBusy] = useState(false);

  async function update(next: OrderStatus) {
    setBusy(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) {
      setStatus(next);
      toast(`Order marked ${next}`);
      router.refresh();
    } else {
      toast("Update failed", "error");
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
    </div>
  );
}

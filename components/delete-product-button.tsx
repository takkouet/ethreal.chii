"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Delete failed.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      aria-label={`Delete ${name}`}
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      Delete
    </button>
  );
}

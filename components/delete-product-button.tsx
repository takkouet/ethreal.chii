"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "./toast";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setBusy(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast(`Deleted "${name}"`);
      setConfirming(false);
      router.refresh();
    } else {
      toast("Delete failed", "error");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete
      </button>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={() => !busy && setConfirming(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-title" className="text-lg font-bold">
              Delete product?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Delete <strong className="text-ink">{name}</strong>? This cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-pink-pale transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="rounded-full bg-coral-dark px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-50"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

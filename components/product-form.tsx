"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "./toast";

type ProductData = {
  id?: string;
  name: string;
  description: string;
  priceVnd: number;
  imageUrl: string;
  stock: number;
  active: boolean;
  category: string | null;
};

export function ProductForm({ initial }: { initial?: ProductData }) {
  const router = useRouter();
  const { toast } = useToast();
  const editing = Boolean(initial?.id);

  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setImageUrl(data.url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!imageUrl) {
      setError("Please provide a product image.");
      return;
    }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      description: String(form.get("description") || ""),
      priceVnd: Number(form.get("priceVnd") || 0),
      stock: Number(form.get("stock") || 0),
      active: form.get("active") === "on",
      category: String(form.get("category") || "").trim() || null,
      imageUrl,
    };

    const url = editing
      ? `/api/admin/products/${initial!.id}`
      : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      setSubmitting(false);
      return;
    }
    toast(editing ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-white p-6 flex flex-col gap-4 max-w-2xl"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={initial?.description}
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priceVnd" className="text-sm font-medium">
            Price (VND)
          </label>
          <input
            id="priceVnd"
            name="priceVnd"
            type="number"
            min={0}
            required
            defaultValue={initial?.priceVnd}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min={0}
            required
            defaultValue={initial?.stock ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium">
          Category (optional)
        </label>
        <input
          id="category"
          name="category"
          placeholder="e.g. Plush, Stationery, Chiikawa"
          defaultValue={initial?.category ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="image" className="text-sm font-medium">
          Product image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mt-1 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-pink-pale file:px-4 file:py-2 file:text-sm file:font-medium file:cursor-pointer"
        />
        {uploading && <p className="mt-2 text-sm text-muted">Uploading…</p>}
        {imageUrl && (
          <div className="relative mt-3 h-32 w-32 rounded-xl overflow-hidden border border-border">
            <Image
              src={imageUrl}
              alt="Product preview"
              fill
              sizes="128px"
              className="object-contain p-2"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="h-4 w-4 accent-coral"
        />
        <span className="text-sm">Visible in store</span>
      </label>

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
        disabled={submitting || uploading}
        className="rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving…" : editing ? "Update product" : "Create product"}
      </button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "stock-asc", label: "Stock: low to high" },
  { value: "stock-desc", label: "Stock: high to low" },
];

export function AdminProductsToolbar({
  q,
  sort,
}: {
  q: string;
  sort: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(q);

  function buildUrl(overrides: Partial<Record<string, string>>) {
    const params = new URLSearchParams();
    const next = { q, sort, ...overrides };
    if (next.q) params.set("q", next.q);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ q: query.trim() }));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={submitSearch} className="relative w-full sm:max-w-xs">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-full border border-border bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-coral"
        />
      </form>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted">Sort</span>
        <select
          value={sort}
          onChange={(e) => router.push(buildUrl({ sort: e.target.value }))}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

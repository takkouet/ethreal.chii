"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name (A–Z)" },
];

export function ProductsToolbar({
  q,
  sort,
  category,
  categories,
}: {
  q: string;
  sort: string;
  category: string;
  categories: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(q);

  // Build a /products URL with the given overrides; resets page on any change.
  function buildUrl(overrides: Partial<Record<string, string>>) {
    const params = new URLSearchParams();
    const next = { q, sort, category, ...overrides };
    if (next.q) params.set("q", next.q);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
    if (next.category) params.set("category", next.category);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ q: query.trim() }));
  }

  return (
    <div className="flex flex-col gap-4">
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
            placeholder="Search goods…"
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

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl({ category: "" })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              category === ""
                ? "bg-coral text-ink"
                : "border border-border hover:bg-pink-pale"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={buildUrl({ category: c })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                category === c
                  ? "bg-coral text-ink"
                  : "border border-border hover:bg-pink-pale"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

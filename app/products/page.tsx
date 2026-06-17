import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ProductsToolbar } from "@/components/products-toolbar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All items — Chiikawa Market",
};

const PAGE_SIZE = 12;

const SORTS: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { priceVnd: "asc" },
  "price-desc": { priceVnd: "desc" },
  name: { name: "asc" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const sort = sp.sort && SORTS[sp.sort] ? sp.sort : "newest";
  const category = (sp.category ?? "").trim();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.ProductWhereInput = {
    active: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: SORTS[sort],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { active: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categoryList = categories
    .map((c) => c.category)
    .filter((c): c is string => Boolean(c))
    .sort();

  // Build a query string preserving filters but overriding page.
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort !== "newest") params.set("sort", sort);
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <Reveal className="mb-6 flex justify-center">
        <h1 className="section-title text-xl sm:text-2xl">ALL ITEMS</h1>
      </Reveal>

      <ProductsToolbar
        q={q}
        sort={sort}
        category={category}
        categories={categoryList}
      />

      {products.length === 0 ? (
        <p className="mt-10 text-center text-muted">
          {q || category
            ? "No products match your search."
            : "No products available yet."}
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p, i) => (
              <Reveal key={p.id} order={i % 4}>
                <ProductCard
                  id={p.id}
                  name={p.name}
                  priceVnd={p.priceVnd}
                  imageUrl={p.imageUrl}
                  stock={p.stock}
                />
              </Reveal>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
                >
                  ← Prev
                </Link>
              )}
              <span className="px-2 text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}

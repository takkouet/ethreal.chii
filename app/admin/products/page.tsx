import Link from "next/link";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { AdminNav } from "@/components/admin-nav";
import { DeleteProductButton } from "@/components/delete-product-button";
import { AdminProductsToolbar } from "@/components/admin-products-toolbar";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const LOW_STOCK = 5;

const SORTS: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  name: { name: "asc" },
  "price-asc": { priceVnd: "asc" },
  "price-desc": { priceVnd: "desc" },
  "stock-asc": { stock: "asc" },
  "stock-desc": { stock: "desc" },
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const sort = sp.sort && SORTS[sp.sort] ? sp.sort : "newest";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where: Prisma.ProductWhereInput = q
    ? { name: { contains: q, mode: "insensitive" } }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: SORTS[sort],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort !== "newest") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <>
      <AdminNav />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
        >
          New product
        </Link>
      </div>

      <AdminProductsToolbar q={q} sort={sort} />

      {products.length === 0 ? (
        <p className="mt-6 text-muted">
          {q ? "No products match your search." : "No products yet."}
        </p>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-pink-pale text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Visible</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-border hover:bg-pink-pale transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border bg-white">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted">{p.category ?? "—"}</td>
                    <td className="px-4 py-3">{formatVnd(p.priceVnd)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.stock <= LOW_STOCK
                            ? "inline-flex rounded-full bg-coral/20 px-2.5 py-0.5 font-bold text-coral-dark"
                            : ""
                        }
                      >
                        {p.stock}
                        {p.stock <= LOW_STOCK && (
                          <span className="sr-only"> (low stock)</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.active ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-full px-3 py-1 text-ink hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-6 flex items-center justify-center gap-2"
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
    </>
  );
}

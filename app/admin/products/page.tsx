import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { AdminNav } from "@/components/admin-nav";
import { DeleteProductButton } from "@/components/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

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

      {products.length === 0 ? (
        <p className="text-muted">No products yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-pink-pale text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
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
                  <td className="px-4 py-3">{formatVnd(p.priceVnd)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
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
      )}
    </>
  );
}

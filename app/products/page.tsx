import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All items — Chiikawa Market",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <Reveal className="mb-8 flex justify-center">
        <h1 className="section-title text-xl sm:text-2xl">ALL ITEMS</h1>
      </Reveal>

      {products.length === 0 ? (
        <p className="text-center text-muted">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
      )}
    </section>
  );
}

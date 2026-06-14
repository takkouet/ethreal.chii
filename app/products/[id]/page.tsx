import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product || !product.active) notFound();

  const inStock = product.stock > 0;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <Link
        href="/products"
        className="text-muted hover:text-coral transition-colors duration-200 cursor-pointer"
      >
        ← Back to products
      </Link>

      <div className="mt-6 grid md:grid-cols-2 gap-8 lg:gap-12">
        <Reveal className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6"
            priority
          />
          {!inStock && (
            <span className="absolute left-3 top-3 rounded-md bg-[#6b7280] px-2.5 py-1 text-xs font-bold text-white">
              Sold out
            </span>
          )}
        </Reveal>

        <Reveal order={1} className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-extrabold text-ink">
            {formatVnd(product.priceVnd)}
            <span className="ml-2 text-base font-normal text-muted">
              (tax included)
            </span>
          </p>
          <p className="mt-6 text-muted whitespace-pre-line leading-relaxed">
            {product.description}
          </p>

          <p className="mt-4 text-sm text-muted">
            {inStock ? `In stock: ${product.stock}` : "Currently out of stock"}
          </p>

          <div className="mt-8">
            <AddToCartButton
              inStock={inStock}
              product={{
                productId: product.id,
                name: product.name,
                priceVnd: product.priceVnd,
                imageUrl: product.imageUrl,
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Testimonials } from "@/components/testimonials";
import { HeroCarousel } from "@/components/hero-carousel";

export const dynamic = "force-dynamic";

const banners = [
  { src: "/market/banner1.png", alt: "New Chiikawa goods now available", href: "/products" },
  { src: "/market/banner2.png", alt: "Chiikawa Park goods", href: "/products" },
  { src: "/market/banner3.png", alt: "Choosable gift catalogue", href: "/products" },
];

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="flex flex-col gap-12 py-8 sm:py-10">
      {/* Hero — auto-advancing banner carousel (real chiikawamarket.jp art) */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <HeroCarousel slides={banners} />
      </section>

      {/* New items — full-bleed pink stripe band (contrast vs starry hero) */}
      <section className="bg-stripe border-y border-border py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-7 flex flex-col items-center gap-3">
            <h2 className="section-title text-xl sm:text-2xl">NEW ITEMS</h2>
          </Reveal>

          {featured.length === 0 ? (
            <p className="text-center text-muted">No products yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {featured.map((p, i) => (
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

          <Reveal className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center rounded-full bg-coral px-8 py-3 font-bold text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
            >
              View all items →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Customer feedback — transparent (starry page bg shows through) */}
      <Testimonials />
    </div>
  );
}

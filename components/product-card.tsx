import Link from "next/link";
import Image from "next/image";
import { formatVnd } from "@/lib/money";

type Props = {
  id: string;
  name: string;
  priceVnd: number;
  imageUrl: string;
  stock?: number;
};

export function ProductCard({ id, name, priceVnd, imageUrl, stock }: Props) {
  const soldOut = stock !== undefined && stock <= 0;

  return (
    <Link
      href={`/products/${id}`}
      className="hover-lift group relative block rounded-2xl border border-border bg-white overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute left-2 top-2 rounded-md bg-[#6b7280] px-2 py-1 text-xs font-bold text-white">
            Sold out
          </span>
        )}
      </div>
      {/* Card information — chiikawamarket.jp convention: right-aligned, medium
          title, larger price */}
      <div className="border-t border-border p-3 text-right">
        <h3 className="text-left text-base font-medium leading-snug line-clamp-2 min-h-11">
          {name}
        </h3>
        <p className="mt-1.5 text-lg text-ink">
          <span className="sr-only">Regular price </span>
          {formatVnd(priceVnd)}
        </p>
      </div>
    </Link>
  );
}

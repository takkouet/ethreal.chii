"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { formatVnd } from "@/lib/money";
import { Reveal } from "@/components/reveal";

export default function CartPage() {
  const { items, totalVnd, setQuantity, remove } = useCart();

  return (
    <Reveal as="section" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-4xl font-bold mb-8">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-muted">
          <p>Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Browse goods
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-border bg-white p-4"
              >
                <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-pink-pale">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`Remove ${item.name}`}
                      className="text-muted hover:text-coral transition-colors duration-200 cursor-pointer"
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-pink-pale transition-colors duration-200 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-bold text-ink">
                      {formatVnd(item.priceVnd * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-2xl border border-border bg-pink-pale p-6 h-fit">
            <h2 className="text-xl font-bold">Summary</h2>
            <div className="mt-4 flex justify-between text-lg">
              <span>Total</span>
              <span className="font-bold text-ink">
                {formatVnd(totalVnd)}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Shipping calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-6 flex justify-center rounded-full bg-coral px-6 py-3 font-medium text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </Reveal>
  );
}

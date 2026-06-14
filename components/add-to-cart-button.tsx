"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import type { CartItem } from "@/lib/types";

export function AddToCartButton({
  product,
  inStock,
}: {
  product: Omit<CartItem, "quantity">;
  inStock: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!inStock}
      className="inline-flex items-center gap-2 rounded-full bg-coral px-8 py-3 font-bold text-ink hover:bg-coral-dark hover:text-white transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {added ? (
        <>
          <Check className="h-5 w-5" aria-hidden="true" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          {inStock ? "Add to cart" : "Out of stock"}
        </>
      )}
    </button>
  );
}

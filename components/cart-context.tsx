"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "chiikawa_cart";
const CART_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalVnd: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount (client-only hydration).
  // Cart expires 10 min after the last change; stale carts are discarded.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const fresh =
          parsed &&
          Array.isArray(parsed.items) &&
          typeof parsed.savedAt === "number" &&
          Date.now() - parsed.savedAt <= CART_TTL_MS;
        if (fresh) {
          // Backfill stock for carts saved before `stock` was tracked, so the
          // quantity clamp (Math.min) never sees undefined.
          const items: CartItem[] = parsed.items.map((i: CartItem) => ({
            ...i,
            stock: typeof i.stock === "number" ? i.stock : i.quantity,
          }));
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(items);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid clobbering).
  // Each write refreshes savedAt, so the 10-min window restarts on activity.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, savedAt: Date.now() }),
    );
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        // Refresh the cached stock from the latest add, then clamp.
        const cap = item.stock;
        return prev.map((i) =>
          i.productId === item.productId
            ? {
                ...i,
                stock: cap,
                quantity: Math.min(i.quantity + qty, cap),
              }
            : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(qty, item.stock) }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(qty, i.stock) }
              : i
          )
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const totalVnd = items.reduce((n, i) => n + i.priceVnd * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, totalVnd, add, setQuantity, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

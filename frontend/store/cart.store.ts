import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      add: (product, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.product.slug === product.slug);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.product.slug === product.slug
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, { product, quantity }] };
        });
      },

      remove: (slug) => {
        set((state) => ({ lines: state.lines.filter((l) => l.product.slug !== slug) }));
      },

      setQuantity: (slug, quantity) => {
        if (quantity < 1) {
          get().remove(slug);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) => (l.product.slug === slug ? { ...l, quantity } : l)),
        }));
      },

      clear: () => set({ lines: [] }),

      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),

      subtotal: () => get().lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    }),
    { name: "mh-store-cart" }
  )
);

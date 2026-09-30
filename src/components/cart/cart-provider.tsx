"use client";

import { track } from "@/lib/analytics";
import { cartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";
import { useCatalog } from "../catalog-provider";
import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";

type CartUI = { open: boolean; setOpen: (open: boolean) => void };

const CartUIContext = createContext<CartUI | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCart() {
  const ui = useContext(CartUIContext);
  if (!ui) throw new Error("useCart must be used inside <CartProvider>");

  const raw = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const { products } = useCatalog();

  // Products removed or unpublished by the owner drop out of the cart automatically.
  const lines = useMemo(
    () =>
      raw.flatMap(({ slug, qty }) => {
        const product = products.find((p) => p.slug === slug);
        return product ? [{ product, qty }] : [];
      }),
    [raw, products],
  );

  const { setOpen } = ui;
  const add = useCallback(
    (product: Product, qty = 1) => {
      cartStore.add(product.slug, qty);
      track("add_to_cart", { productSlug: product.slug });
      setOpen(true);
    },
    [setOpen],
  );

  return {
    ...ui,
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    add,
    setQty: cartStore.setQty,
    remove: cartStore.remove,
    clear: cartStore.clear,
  };
}

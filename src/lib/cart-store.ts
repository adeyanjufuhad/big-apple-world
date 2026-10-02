// Tiny external store for the cart, persisted to localStorage.
// Read it through useSyncExternalStore (see components/cart/cart-provider).
// Each line keeps a snapshot of the product, so the browser never needs the whole
// catalog. Checkout re-prices everything on the server from the database.

import type { Product } from "./products";

export type CartLine = { slug: string; qty: number; product: Product };

const KEY = "baw-cart";
const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    // Older carts stored only slugs; drop those lines rather than show broken items.
    if (Array.isArray(saved)) lines = saved.filter((l) => l && typeof l.slug === "string" && l.product);
  } catch {
    // Storage unavailable or corrupted — start empty.
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Ignore quota / private-mode errors; the cart still works for this visit.
  }
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    load();
    return lines;
  },
  getServerSnapshot() {
    return EMPTY;
  },
  add(product: Product, qty = 1) {
    const existing = lines.find((l) => l.slug === product.slug);
    commit(
      existing
        ? lines.map((l) => (l.slug === product.slug ? { ...l, qty: l.qty + qty, product } : l))
        : [...lines, { slug: product.slug, qty, product }],
    );
  },
  setQty(slug: string, qty: number) {
    commit(qty <= 0 ? lines.filter((l) => l.slug !== slug) : lines.map((l) => (l.slug === slug ? { ...l, qty } : l)));
  },
  remove(slug: string) {
    commit(lines.filter((l) => l.slug !== slug));
  },
  clear() {
    commit(EMPTY);
  },
};

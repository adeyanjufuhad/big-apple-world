// Tiny external store for the cart, persisted to localStorage.
// Read it through useSyncExternalStore (see components/cart/cart-provider).

export type CartLine = { slug: string; qty: number };

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
    if (Array.isArray(saved)) lines = saved;
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
  add(slug: string, qty = 1) {
    const existing = lines.find((l) => l.slug === slug);
    commit(
      existing
        ? lines.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
        : [...lines, { slug, qty }],
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

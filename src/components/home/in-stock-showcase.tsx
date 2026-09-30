"use client";

import { ProductCard } from "@/components/shop/product-card";
import { categories, inStock } from "@/lib/products";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const tabs = [
  { slug: "all", name: "All products" },
  ...categories.filter((c) => inStock.some((p) => p.category === c.slug)),
];

export function InStockShowcase() {
  const [active, setActive] = useState("all");
  const items = (active === "all" ? inStock : inStock.filter((p) => p.category === active)).slice(0, 8);

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter in-stock products"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:justify-center"
      >
        {tabs.map((t) => {
          const selected = active === t.slug;
          return (
            <button
              key={t.slug}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.slug)}
              className={cn(
                "relative h-11 shrink-0 rounded-full px-5 text-sm whitespace-nowrap ring-1 transition-colors",
                selected ? "ring-transparent" : "bg-white ring-line hover:ring-ink",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="stock-tab"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className={cn("relative", selected ? "text-white" : "text-ink")}>{t.name}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

"use client";

import type { Product } from "@/lib/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "./product-card";

export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={scroller}
        role="region"
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0"
      >
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-18px)]" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-3rem)] hidden justify-between lg:flex">
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="pointer-events-auto -ml-5 grid size-10 place-items-center rounded-full bg-white shadow-md ring-1 ring-line transition-colors hover:bg-ink hover:text-white"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="pointer-events-auto -mr-5 grid size-10 place-items-center rounded-full bg-white shadow-md ring-1 ring-line transition-colors hover:bg-ink hover:text-white"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

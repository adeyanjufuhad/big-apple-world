"use client";

import { Section } from "@/components/home/section";
import type { Product } from "@/lib/products";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "./product-card";

/** A section whose products scroll sideways, with round arrow controls beside the heading. */
export function RailSection({
  id,
  eyebrow,
  title,
  link,
  products,
  className,
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  link?: { href: string; label: string };
  products: Product[];
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <Section
      id={id}
      eyebrow={eyebrow}
      title={title}
      link={link}
      className={className}
      action={
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="grid size-11 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-ink hover:text-white hover:ring-ink"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="grid size-11 place-items-center rounded-full bg-apple text-white transition-colors hover:bg-apple-deep"
          >
            <ArrowRight className="size-4.5" />
          </button>
        </div>
      }
    >
      <div
        ref={scroller}
        role="region"
        aria-label={typeof title === "string" ? title : "Products"}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0"
      >
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} className="w-[70%] shrink-0 snap-start sm:w-[40%] md:w-[31%] lg:w-[calc(25%-18px)]" />
        ))}
      </div>
    </Section>
  );
}

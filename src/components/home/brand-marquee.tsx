"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { brands, type Brand } from "@/lib/brands";
import type { Category } from "@/lib/products";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function Separator() {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white lg:size-16">
      <Image src="/logo.png" alt="" width={32} height={33} className="size-7 lg:size-9" />
    </span>
  );
}

function WordRow({ categories, outline, reverse }: { categories: Category[]; outline?: boolean; reverse?: boolean }) {
  return (
    <InfiniteSlider gap={40} speed={55} reverse={reverse}>
      {categories.map((c) => (
        <span key={c.slug} className="flex items-center gap-10">
          <span
            className={cn(
              "text-6xl leading-[1.1] font-medium tracking-[-0.04em] whitespace-nowrap sm:text-7xl lg:text-[7rem]",
              outline && "text-outline",
            )}
          >
            {c.name}
          </span>
          <Separator />
        </span>
      ))}
    </InfiniteSlider>
  );
}

function BrandRow({ items, reverse }: { items: Brand[]; reverse?: boolean }) {
  return (
    <InfiniteSlider gap={72} speed={36} speedOnHover={12} reverse={reverse}>
      {items.map((b) => (
        <Link
          key={b.name}
          href={`/shop?q=${encodeURIComponent(b.query)}`}
          className="font-display text-3xl whitespace-nowrap text-white/70 italic transition-colors hover:text-white sm:text-4xl"
        >
          {b.logo ? <Image src={b.logo} alt={b.name} width={120} height={40} className="h-9 w-auto brightness-0 invert" /> : b.name}
        </Link>
      ))}
    </InfiniteSlider>
  );
}

// Logo-cloud pattern from 21st.dev (InfiniteSlider) on a brand-navy band: two rows of the
// brands we stock (each links to its products), then two giant counter-scrolling category rows.
export function BrandMarquee({ categories }: { categories: Category[] }) {
  return (
    <section aria-labelledby="brands-heading" className="relative isolate overflow-hidden bg-navy py-16 text-white lg:py-24">
      <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-apple/20 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="brands-heading" className="text-center text-xs font-medium tracking-[0.3em] text-white/60 uppercase">
          Brands available in store
        </h2>

        {/* A mask fades the edges into whatever is behind, so no visible boxes over the glow. */}
        <div className="mt-8 space-y-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <BrandRow items={brands.filter((_, i) => i % 2 === 0)} />
          <BrandRow items={brands.filter((_, i) => i % 2 === 1)} reverse />
        </div>
      </div>

      <div className="mt-14 -rotate-2 space-y-3 lg:mt-20">
        <WordRow categories={categories} />
        <WordRow categories={categories} outline reverse />
      </div>
    </section>
  );
}

"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { brands } from "@/lib/brands";
import type { Category } from "@/lib/products";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

// Logo-cloud pattern from 21st.dev (InfiniteSlider + ProgressiveBlur) on a brand-navy band,
// followed by two giant counter-scrolling category rows.
export function BrandMarquee({ categories }: { categories: Category[] }) {
  return (
    <section aria-labelledby="brands-heading" className="relative isolate overflow-hidden bg-navy py-16 text-white lg:py-24">
      <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-apple/20 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="brands-heading" className="text-center text-xs font-medium tracking-[0.3em] text-white/60 uppercase">
          Brands available in store
        </h2>

        <div className="relative mt-8">
          <InfiniteSlider gap={80} speed={40} speedOnHover={15}>
            {brands.map((b) =>
              b.logo ? (
                <Image key={b.name} src={b.logo} alt={b.name} width={120} height={40} className="h-9 w-auto brightness-0 invert" />
              ) : (
                <span
                  key={b.name}
                  className="font-display text-3xl whitespace-nowrap text-white/75 italic transition-colors hover:text-white sm:text-4xl"
                >
                  {b.name}
                </span>
              ),
            )}
          </InfiniteSlider>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-navy" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy" />
          <ProgressiveBlur className="pointer-events-none absolute inset-y-0 left-0 w-24" direction="left" blurIntensity={1} />
          <ProgressiveBlur className="pointer-events-none absolute inset-y-0 right-0 w-24" direction="right" blurIntensity={1} />
        </div>
      </div>

      <div className="mt-14 -rotate-2 space-y-3 lg:mt-20">
        <WordRow categories={categories} />
        <WordRow categories={categories} outline reverse />
      </div>
    </section>
  );
}

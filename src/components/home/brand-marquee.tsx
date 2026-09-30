"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { brands } from "@/lib/brands";
import { categories } from "@/lib/products";
import Image from "next/image";

// Logo-cloud pattern from 21st.dev: InfiniteSlider + ProgressiveBlur edges.
export function BrandMarquee() {
  return (
    <section aria-labelledby="brands-heading" className="overflow-hidden border-y border-line bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="brands-heading" className="text-center text-xs font-medium tracking-[0.25em] text-muted uppercase">
          Brands available in store
        </h2>

        <div className="relative mt-8">
          <InfiniteSlider gap={72} speed={40} speedOnHover={15}>
            {brands.map((b) =>
              b.logo ? (
                <Image key={b.name} src={b.logo} alt={b.name} width={120} height={40} className="h-9 w-auto opacity-70" />
              ) : (
                <span
                  key={b.name}
                  className="font-display text-3xl whitespace-nowrap text-ink/70 italic transition-colors hover:text-navy"
                >
                  {b.name}
                </span>
              ),
            )}
          </InfiniteSlider>
          <ProgressiveBlur className="pointer-events-none absolute inset-y-0 left-0 w-24" direction="left" blurIntensity={1} />
          <ProgressiveBlur className="pointer-events-none absolute inset-y-0 right-0 w-24" direction="right" blurIntensity={1} />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white" />
        </div>
      </div>

      <InfiniteSlider gap={40} speed={60} reverse className="mt-12 lg:mt-16">
        {categories.map((c, i) => (
          <span key={c.slug} className="flex items-center gap-10 font-display text-6xl whitespace-nowrap sm:text-7xl lg:text-8xl">
            <span className={i % 2 ? "text-navy" : "text-ink"}>{c.name}</span>
            <Image src="/logo.png" alt="" width={44} height={46} className="size-10 lg:size-12" />
          </span>
        ))}
      </InfiniteSlider>
    </section>
  );
}

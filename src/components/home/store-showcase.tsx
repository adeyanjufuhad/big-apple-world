"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow, headingClass } from "./section";

/** A "shop window" of products inside the 21st.dev container scroll card, which straightens as you scroll. */
export function StoreShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-label="Shop window" className="overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center px-4">
            <Eyebrow>Step inside the store</Eyebrow>
            <h2 className={`${headingClass} mt-3 max-w-3xl`}>
              Everything your salon runs on,{" "}
              <em className="font-display font-normal tracking-normal text-apple">under one roof.</em>
            </h2>
          </div>
        }
      >
        <ul className="grid h-full grid-cols-2 gap-2 overflow-hidden p-2 md:grid-cols-4 md:gap-3 md:p-0">
          {products.slice(0, 8).map((p, i) => (
            <li key={p.slug} className={`relative overflow-hidden rounded-xl bg-white ${i >= 6 ? "hidden md:block" : ""}`}>
              <Link href={`/product/${p.slug}`} className="group flex h-full flex-col">
                <div className="relative flex-1">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 768px) 240px, 45vw"
                    className="object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2 text-xs">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="shrink-0 tabular-nums text-muted">{formatPrice(p.price)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </ContainerScroll>
    </section>
  );
}

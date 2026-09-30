import { AddToCartButton } from "@/components/cart/add-to-cart";
import { ProductCard } from "@/components/shop/product-card";
import { bestSellers, getCategory } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const LEAD = "professional-hair-styling-kit";

export function BestSellers() {
  const lead = bestSellers.find((p) => p.slug === LEAD) ?? bestSellers[0];
  const rest = bestSellers.filter((p) => p !== lead).slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
      <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-navy text-white">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-apple/40 blur-[90px]" />
        <Link
          href={`/product/${lead.slug}`}
          className="relative m-3 block aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-sand lg:aspect-auto lg:flex-1"
        >
          <Image
            src={lead.image}
            alt={lead.name}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rounded-full bg-apple px-3 py-1 text-xs font-medium text-white">
            #1 Best seller
          </span>
        </Link>
        <div className="relative flex flex-col gap-5 p-7 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-white/60">{getCategory(lead.category)?.name}</p>
            <h3 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
              <Link href={`/product/${lead.slug}`} className="hover:underline">
                {lead.name}
              </Link>
            </h3>
            <p className="mt-2 text-lg font-semibold tabular-nums">{formatPrice(lead.price)}</p>
          </div>
          <AddToCartButton product={lead} variant="light" size="lg" />
        </div>
      </article>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:gap-x-6">
        {rest.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

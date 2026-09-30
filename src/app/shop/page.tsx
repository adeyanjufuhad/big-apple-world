import { ProductCard } from "@/components/shop/product-card";
import { getCatalog } from "@/lib/catalog";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Shop" };

type Params = { category?: string; q?: string; stock?: string; sort?: string };

const sorts: Record<string, { label: string; fn: (a: Product, b: Product) => number }> = {
  featured: { label: "Featured", fn: () => 0 },
  best: { label: "Best sellers", fn: (a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) },
  new: { label: "Newest", fn: (a, b) => Number(!!b.newArrival) - Number(!!a.newArrival) },
  "price-asc": { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a, b) => b.price - a.price },
};

function href(current: Params, patch: Partial<Params>) {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams(
    Object.entries(next).filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== ""),
  );
  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}

const chip = "inline-flex h-10 items-center rounded-full border px-5 text-sm whitespace-nowrap transition-colors";

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const { categories, products } = await getCatalog();
  const { category, q = "", stock, sort = "featured" } = params;
  const activeCategory = category ? categories.find((c) => c.slug === category) : undefined;
  const query = q.trim().toLowerCase();

  const results = products
    .filter((p) => !activeCategory || p.category === activeCategory.slug)
    .filter((p) => !stock || p.inStock)
    .filter(
      (p) =>
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query),
    )
    .sort((sorts[sort] ?? sorts.featured).fn);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-10 text-white sm:px-10 lg:py-14">
        <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light" />
        <div className="pointer-events-none absolute -top-32 -right-16 -z-10 size-96 rounded-full bg-apple/35 blur-[110px]" />
        <p className="text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          / Shop
        </p>
        <h1 className="mt-3 text-5xl leading-[1] font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          {activeCategory?.name ?? (query ? `“${q}”` : "All products")}
        </h1>
        <p className="mt-3 text-white/70">
          {results.length} {results.length === 1 ? "product" : "products"} · wholesale prices, ordered on WhatsApp
        </p>
      </div>

      <div className="sticky top-[7.5rem] z-20 -mx-4 mt-6 md:top-[4.5rem] border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <nav aria-label="Categories" className="no-scrollbar flex gap-2 overflow-x-auto">
          <Link
            href={href(params, { category: undefined })}
            className={cn(chip, !activeCategory ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink")}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={href(params, { category: c.slug })}
              className={cn(
                chip,
                activeCategory?.slug === c.slug ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">
            {results.length} {results.length === 1 ? "product" : "products"}
          </span>
          <Link
            href={href(params, { stock: stock ? undefined : "1" })}
            className={cn(chip, "h-8 px-3", stock ? "border-navy bg-navy-soft text-navy" : "border-line bg-white hover:border-ink")}
          >
            In stock only
          </Link>
          {query && (
            <Link href={href(params, { q: undefined })} className={cn(chip, "h-8 gap-1.5 border-line bg-white px-3 hover:border-ink")}>
              “{q}” <X className="size-3.5" />
            </Link>
          )}
        </div>

        <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 text-sm sm:mx-0 sm:px-0">
          {Object.entries(sorts).map(([key, s]) => (
            <Link
              key={key}
              href={href(params, { sort: key === "featured" ? undefined : key })}
              className={cn(
                "rounded-full px-3 py-1.5 whitespace-nowrap transition-colors",
                sort === key ? "bg-sand font-medium text-ink" : "text-muted hover:text-ink",
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-3xl border border-dashed border-line py-20 text-center">
          <p className="font-display text-3xl">Nothing found</p>
          <p className="mt-2 text-muted">Try another search or category — or ask us on WhatsApp, we probably have it.</p>
          <Link href="/shop" className="mt-6 inline-block text-sm font-medium text-navy underline-offset-4 hover:underline">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}

import { ProductPurchase } from "@/components/shop/product-purchase";
import { ProductRail } from "@/components/shop/product-rail";
import { getCategory, getProduct, products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const more = related.length >= 2 ? related : products.filter((p) => p.slug !== product.slug).slice(0, 8);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          /{" "}
          <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
            {category?.name}
          </Link>
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-sand">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-8 mix-blend-multiply sm:p-12"
            />
          </div>

          <div className="lg:py-6">
            <p className="text-sm text-muted">{category?.name}</p>
            <h1 className="mt-2 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">{product.name}</h1>
            <p className="mt-5 text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</p>

            <p className="mt-3 inline-flex items-center gap-2 text-sm">
              {product.inStock ? (
                <>
                  <Check className="size-4 text-emerald-600" /> In stock
                </>
              ) : (
                <>
                  <Clock className="size-4 text-muted" /> Sold out — ask us about restock
                </>
              )}
            </p>

            <p className="mt-6 max-w-lg leading-relaxed text-muted">{product.description}</p>

            <ProductPurchase product={product} />

            <ul className="mt-10 space-y-3 border-t border-line pt-8 text-sm text-muted">
              <li>• Orders are completed on WhatsApp — we confirm availability, price and delivery with you.</li>
              <li>• Buying in bulk? Ask for wholesale quantity pricing.</li>
              <li>• Pick up in store at Balogun Market, Lagos Island.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-display text-4xl leading-none tracking-tight">You may also like</h2>
        <ProductRail products={more} label="Related products" />
      </section>
    </>
  );
}

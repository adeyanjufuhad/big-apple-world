import { headingClass } from "@/components/home/section";
import { ProductCard } from "@/components/shop/product-card";
import { ProductPurchase } from "@/components/shop/product-purchase";
import { getCatalog, getProduct } from "@/lib/catalog";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, ChevronDown, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Pre-build the featured products; the rest are rendered on first visit and cached,
  // which keeps deploys fast with a large catalog.
  const { products } = await getCatalog();
  const featured = products.filter((p) => p.bestSeller || p.newArrival);
  return [...featured, ...products].slice(0, 40).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

function Accordion({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group rounded-2xl ring-1 ring-line [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium">
        {title}
        <ChevronDown className="size-4.5 text-muted transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const { products } = await getCatalog();
  const category = { name: product.categoryName };
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const more = [...related, ...products.filter((p) => p.category !== product.category)].slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-sm text-muted">
          <Link
            href={`/shop?category=${product.category}`}
            aria-label={`Back to ${category?.name}`}
            className="grid size-8 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-ink hover:text-white hover:ring-ink"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
            {category?.name}
          </Link>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-sand lg:sticky lg:top-28 lg:self-start">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain p-10 mix-blend-multiply sm:p-16"
            />
            {product.bestSeller && (
              <span className="absolute top-5 left-5 rounded-full bg-apple px-3 py-1 text-xs font-medium text-white">
                Best seller
              </span>
            )}
          </div>

          <div>
            <span className="inline-block rounded-full px-3 py-1 text-xs ring-1 ring-line">{category?.name}</span>
            <h1 className="mt-4 text-4xl leading-[1.02] font-medium tracking-[-0.035em] sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-3xl font-semibold tabular-nums">{formatPrice(product.price)}</p>

            <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-sand px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-5">
              <span className="inline-flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <Check className="size-4 text-emerald-600" /> In stock
                  </>
                ) : (
                  <>
                    <Clock className="size-4 text-muted" /> Sold out — ask about restock
                  </>
                )}
              </span>
              <span className="inline-flex items-center gap-2 text-muted">
                <MapPin className="size-4" /> Pickup at Balogun Market
              </span>
            </div>

            <div className="mt-8">
              <ProductPurchase product={product} />
            </div>

            <div className="mt-8 space-y-3">
              <Accordion title="Description" open>
                {product.description}
              </Accordion>
              <Accordion title="How ordering works">
                <ol className="list-decimal space-y-1.5 pl-4">
                  <li>Add what you need to your cart.</li>
                  <li>Tap “Checkout on WhatsApp” — your order is sent to us as a message.</li>
                  <li>We confirm availability, final price and delivery or pickup with you.</li>
                </ol>
              </Accordion>
              <Accordion title="Pickup & delivery">
                <p>
                  Pick up in store at {site.address.join(", ")} — {site.hours}.
                </p>
                <p className="mt-2">Need delivery? Ask us on WhatsApp and we’ll share the options for your area.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <h2 className={`${headingClass} mb-10 text-center lg:mb-12`}>You might also like</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {more.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

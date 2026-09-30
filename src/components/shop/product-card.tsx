import { AddToCartButton, QuickAdd } from "@/components/cart/add-to-cart";
import { WhatsAppIcon } from "@/components/icons";
import { getCategory, type Product } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import { productEnquiry, whatsappLink } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
import { QuickViewButton } from "./quick-view";

function Badge({ product }: { product: Product }) {
  const base = "rounded-full px-3 py-1 text-[11px] font-medium";
  if (!product.inStock) return <span className={cn(base, "bg-white text-muted")}>Sold out</span>;
  if (product.bestSeller) return <span className={cn(base, "bg-apple text-white")}>Best seller</span>;
  if (product.newArrival) return <span className={cn(base, "bg-navy text-white")}>New</span>;
  return null;
}

const sideBtn =
  "grid size-9 place-items-center rounded-full bg-white text-ink shadow-sm transition-colors hover:bg-ink hover:text-white";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const href = `/product/${product.slug}`;
  return (
    <article className={cn("group", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-sand">
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={cn(
              "object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.06]",
              !product.inStock && "opacity-55 grayscale-[40%]",
            )}
          />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3">
          <Badge product={product} />
        </div>

        <div className="absolute top-3 right-3 hidden flex-col gap-2 transition-all duration-300 md:flex md:translate-x-3 md:opacity-0 md:group-focus-within:translate-x-0 md:group-focus-within:opacity-100 md:group-hover:translate-x-0 md:group-hover:opacity-100">
          <QuickViewButton product={product} className={sideBtn} />
          <a
            href={whatsappLink(productEnquiry(product))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${product.name} on WhatsApp`}
            title="Ask on WhatsApp"
            className={sideBtn}
          >
            <WhatsAppIcon className="size-4" />
          </a>
        </div>

        {product.inStock && (
          <>
            <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:block">
              <AddToCartButton product={product} className="w-full shadow-lg shadow-ink/15" />
            </div>
            <div className="absolute right-3 bottom-3 md:hidden">
              <QuickAdd product={product} />
            </div>
          </>
        )}
      </div>

      <div className="mt-3.5 px-1">
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span className="truncate">{getCategory(product.category)?.name}</span>
          {product.inStock && (
            <span className="inline-flex shrink-0 items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              In stock
            </span>
          )}
        </div>
        <h3 className="mt-1.5 text-[15px] leading-snug font-medium">
          <Link href={href} className="decoration-1 underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[15px] font-semibold tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

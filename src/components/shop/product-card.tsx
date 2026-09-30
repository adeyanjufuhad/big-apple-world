import { QuickAdd } from "@/components/cart/add-to-cart";
import { getCategory, type Product } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function Badge({ product }: { product: Product }) {
  if (!product.inStock)
    return <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-muted">Sold out</span>;
  if (product.bestSeller)
    return <span className="rounded-full bg-apple px-2.5 py-1 text-[11px] font-medium text-white">Best seller</span>;
  if (product.newArrival)
    return <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-medium text-white">New</span>;
  return null;
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const href = `/product/${product.slug}`;
  return (
    <article className={cn("group", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={cn(
              "object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              !product.inStock && "opacity-60",
            )}
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-3">
          <Badge product={product} />
        </div>
        {product.inStock && (
          <div className="absolute right-3 bottom-3 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-within:translate-y-0 md:focus-within:opacity-100">
            <QuickAdd product={product} />
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <p className="text-xs text-muted">{getCategory(product.category)?.name}</p>
        <h3 className="text-[15px] leading-snug font-medium">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="text-[15px] font-semibold tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

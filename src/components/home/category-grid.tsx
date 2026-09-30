import { categories, products } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

export function CategoryGrid() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
      {categories.map((c) => {
        const count = products.filter((p) => p.category === c.slug).length;
        return (
          <li key={c.slug}>
            <Link href={`/shop?category=${c.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-full bg-sand ring-1 ring-transparent transition-all duration-300 group-hover:ring-navy">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                  className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-center text-[15px] font-medium">{c.name}</p>
              <p className="text-center text-xs text-muted">
                {count} {count === 1 ? "product" : "products"}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

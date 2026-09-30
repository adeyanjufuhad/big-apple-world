import type { Category, Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Tile sizing by position: a tall feature card, two wide cards, then rows of three.
// Works for any number of categories the owner adds in the admin.
function tile(i: number, total: number) {
  if (i === 0)
    return {
      className: "sm:col-span-2 lg:col-span-5 lg:row-span-2 min-h-[380px] lg:min-h-[560px]",
      imageClass: "right-0 bottom-0 h-[62%] w-[70%]",
      feature: true,
    };
  if (i <= 2)
    return {
      className: "lg:col-span-7 min-h-[260px]",
      imageClass: "right-2 bottom-0 h-full w-[48%]",
      feature: false,
    };
  const lastOdd = i === total - 1 && (total - 3) % 2 === 1;
  return {
    className: cn("lg:col-span-4 min-h-[260px]", lastOdd && "sm:col-span-2"),
    imageClass: "right-0 bottom-0 h-[80%] w-[55%]",
    feature: false,
  };
}

export function CategoryBento({ categories, products }: { categories: Category[]; products: Product[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
      {categories.map((category, i) => {
        const items = products.filter((p) => p.category === category.slug);
        const { className, imageClass, feature } = tile(i, categories.length);
        return (
          <li key={category.slug} className={className}>
            <Link
              href={`/shop?category=${category.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-sand p-6 transition-colors hover:bg-[#efece7] sm:p-7"
            >
              <span className="w-fit rounded-full bg-white px-3 py-1 text-xs">
                <span className="font-semibold text-apple">{items.length}</span> {items.length === 1 ? "item" : "items"}
              </span>
              <h3
                className={cn(
                  "relative z-10 mt-4 max-w-[60%] leading-[1] font-medium tracking-[-0.03em]",
                  feature ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl",
                )}
              >
                {category.name}
              </h3>
              <ul className="relative z-10 mt-4 max-w-[48%] space-y-1.5 text-sm text-muted">
                {items.slice(0, feature ? 5 : 3).map((p) => (
                  <li key={p.slug} className="truncate">
                    {p.name}
                  </li>
                ))}
              </ul>
              <span className="relative z-10 mt-auto grid size-11 place-items-center rounded-full bg-ink text-white transition-colors group-hover:bg-apple">
                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
              </span>
              <div className={cn("absolute", imageClass)}>
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes={feature ? "(min-width: 1024px) 30vw, 70vw" : "(min-width: 1024px) 20vw, 50vw"}
                  className="object-contain object-bottom p-3 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-rotate-2"
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

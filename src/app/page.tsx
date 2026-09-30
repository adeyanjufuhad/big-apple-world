import { BrandMarquee } from "@/components/home/brand-marquee";
import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import { Section } from "@/components/home/section";
import { Visit } from "@/components/home/visit";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ProductCard } from "@/components/shop/product-card";
import { ProductRail } from "@/components/shop/product-rail";
import { bestSellers, inStock, newArrivals } from "@/lib/products";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="categories" title="Shop by category" link={{ href: "/shop", label: "Shop all" }}>
        <CategoryGrid />
      </Section>

      <Section
        id="in-stock"
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available today
          </span>
        }
        title="In stock"
        link={{ href: "/shop?stock=1", label: "View all in stock" }}
      >
        <ProductRail products={inStock} label="In stock products" />
      </Section>

      <Section id="best-sellers" title="Best sellers" link={{ href: "/shop?sort=best", label: "View all" }} className="pt-0 lg:pt-0">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {bestSellers.slice(0, 8).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <BrandMarquee />

      <Section id="new-arrivals" eyebrow="Just landed" title="New arrivals" link={{ href: "/shop?sort=new", label: "View all" }}>
        <ProductRail products={newArrivals} label="New arrivals" />
      </Section>

      <Section id="why-us" title={<>Why choose <em className="text-apple">Big Apple</em></>} className="pt-0 lg:pt-0">
        <WhyChooseUs />
      </Section>

      <Visit />
    </>
  );
}

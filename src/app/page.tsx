import { BestSellers } from "@/components/home/best-sellers";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { CategoryBento } from "@/components/home/category-bento";
import { Hero } from "@/components/home/hero";
import { InStockShowcase } from "@/components/home/in-stock-showcase";
import { Section } from "@/components/home/section";
import { TrustStrip } from "@/components/home/trust-strip";
import { Visit } from "@/components/home/visit";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { RailSection } from "@/components/shop/product-rail";
import { newArrivals } from "@/lib/products";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />

      <Section id="categories" eyebrow="Browse the store" title="Shop by category" link={{ href: "/shop", label: "Shop all" }}>
        <CategoryBento />
      </Section>

      <Section
        id="in-stock"
        align="center"
        className="pt-0 lg:pt-0"
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available today
          </span>
        }
        title="In stock now"
        link={{ href: "/shop?stock=1", label: "View all in stock" }}
      >
        <InStockShowcase />
      </Section>

      <Section id="best-sellers" eyebrow="Customer favourites" title="Best sellers" link={{ href: "/shop?sort=best", label: "View all" }} className="pt-0 lg:pt-0">
        <BestSellers />
      </Section>

      <BrandMarquee />

      <RailSection
        id="new-arrivals"
        eyebrow="Just landed"
        title="New arrivals"
        link={{ href: "/shop?sort=new", label: "View all" }}
        products={newArrivals}
      />

      <WhyChooseUs />

      <Visit />
    </>
  );
}

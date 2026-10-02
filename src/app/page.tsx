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
import { getCatalog } from "@/lib/catalog";

// Products whose photos have clean white backgrounds show best in the hero arch.
const HERO_PICKS = ["ntfs-facial-steamer", "electric-nail-drill-kit", "extra-virgin-argan-oil", "professional-wax-warmer"];

export default async function Home() {
  const { categories, products } = await getCatalog();
  const inStock = products.filter((p) => p.inStock);
  const bestSellers = products.filter((p) => p.bestSeller);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 12);

  // The in-stock tabs only ever show 8 at a time, so send at most 8 per category
  // (best sellers first) instead of the whole catalog.
  const featured = [...inStock].sort(
    (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.newArrival) - Number(a.newArrival),
  );
  const showcase = [
    ...new Map(
      [...featured.slice(0, 8), ...categories.flatMap((c) => featured.filter((p) => p.category === c.slug).slice(0, 8))].map(
        (p) => [p.slug, p],
      ),
    ).values(),
  ];

  const picks = HERO_PICKS.map((slug) => products.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const heroSlides = [...picks, ...bestSellers.filter((p) => !picks.includes(p))].slice(0, 4);

  return (
    <>
      <Hero slides={heroSlides} />
      <TrustStrip />

      <Section id="categories" eyebrow="Browse the store" title="Shop by category" link={{ href: "/shop", label: "Shop all" }}>
        <CategoryBento categories={categories} products={products} />
      </Section>

      {inStock.length > 0 && (
        <Section
          id="in-stock"
          align="center"
          className="pt-0 lg:pt-0"
          eyebrow="Available today"
          title="In stock now"
          link={{ href: "/shop?stock=1", label: "View all in stock" }}
        >
          <InStockShowcase categories={categories} products={showcase} />
        </Section>
      )}

      {bestSellers.length > 0 && (
        <Section
          id="best-sellers"
          eyebrow="Customer favourites"
          title="Best sellers"
          link={{ href: "/shop?sort=best", label: "View all" }}
          className="pt-0 lg:pt-0"
        >
          <BestSellers products={bestSellers} />
        </Section>
      )}

      <BrandMarquee categories={categories} />

      {newArrivals.length > 0 && (
        <RailSection
          id="new-arrivals"
          eyebrow="Just landed"
          title="New arrivals"
          link={{ href: "/shop?sort=new", label: "View all" }}
          products={newArrivals}
        />
      )}

      <WhyChooseUs floating={products.find((p) => p.slug === "ntfs-facial-steamer") ?? bestSellers[0]} />

      <Visit />
    </>
  );
}

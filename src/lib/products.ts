export type CategorySlug = "nails" | "pedicure-manicure" | "beauty-spa" | "salon-equipment" | "hair-care" | "wellness";

export type Category = {
  slug: CategorySlug;
  name: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Price in Naira. TODO: replace placeholder prices with the store's real prices. */
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
};

export const categories: Category[] = [
  { slug: "nails", name: "Nails & Accessories", image: "/products/nail-lamp.jpg" },
  { slug: "pedicure-manicure", name: "Pedicure & Manicure", image: "/products/pedicure-chair.jpg" },
  { slug: "beauty-spa", name: "Beauty & Spa", image: "/products/facial-steamer.jpg" },
  { slug: "salon-equipment", name: "Salon Equipment", image: "/products/skincare-machine.jpg" },
  { slug: "hair-care", name: "Hair Care", image: "/products/olive-hair-set.jpg" },
  { slug: "wellness", name: "Wellness", image: "/products/neck-massager.jpg" },
];

export const products: Product[] = [
  {
    slug: "cordless-uv-led-nail-lamp",
    name: "Cordless UV/LED Nail Lamp",
    category: "nails",
    price: 38000,
    image: "/products/nail-lamp.jpg",
    description: "Rechargeable professional curing lamp with timer settings and a wide opening for full-hand curing.",
    inStock: true,
    bestSeller: true,
  },
  {
    slug: "electric-nail-drill-kit",
    name: "Electric Nail Drill Kit",
    category: "nails",
    price: 45000,
    image: "/products/nail-drill.jpg",
    description: "Cordless manicure drill with digital speed display and a full set of interchangeable bits.",
    inStock: true,
    newArrival: true,
  },
  {
    slug: "disposable-hair-caps-100",
    name: "Disposable Caps (100 pcs)",
    category: "nails",
    price: 9500,
    image: "/products/hair-caps.jpg",
    description: "Breathable single-use caps for facials, spa treatments and salon hygiene. Pack of 100.",
    inStock: true,
  },
  {
    slug: "luxury-pedicure-chair",
    name: "Luxury Pedicure Chair",
    category: "pedicure-manicure",
    price: 1250000,
    image: "/products/pedicure-chair.jpg",
    description: "Spa pedicure throne with built-in massage, footbath basin and easy-clean upholstery.",
    inStock: false,
    bestSeller: true,
  },
  {
    slug: "professional-wax-warmer",
    name: "Professional Wax Warmer",
    category: "pedicure-manicure",
    price: 42000,
    image: "/products/wax-warmer.jpg",
    description: "Single-pot wax heater with adjustable temperature control for salon and home use.",
    inStock: true,
    bestSeller: true,
  },
  {
    slug: "ntfs-facial-steamer",
    name: "NTFS Facial Steamer",
    category: "beauty-spa",
    price: 36000,
    image: "/products/facial-steamer.jpg",
    description: "Nano-ionic facial steamer that opens pores for deeper cleansing and better product absorption.",
    inStock: true,
    newArrival: true,
  },
  {
    slug: "body-scrub-collection",
    name: "Body Scrub Collection",
    category: "beauty-spa",
    price: 28000,
    image: "/products/body-scrub-collection.jpg",
    description: "Four-piece set of exfoliating body scrubs — coconut, apricot, pineapple and watermelon.",
    inStock: true,
    bestSeller: true,
  },
  {
    slug: "extra-virgin-argan-oil",
    name: "Extra Virgin Argan Oil",
    category: "beauty-spa",
    price: 18000,
    image: "/products/argan-oil.jpg",
    description: "Pure, cold-pressed argan oil for skin, hair and nails.",
    inStock: true,
  },
  {
    slug: "yoni-steam-seat-kit",
    name: "Yoni Steam Seat Kit",
    category: "beauty-spa",
    price: 120000,
    image: "/products/steam-seat.jpg",
    description: "Complete steam seat kit with remote control and herbal steam pouches.",
    inStock: true,
    newArrival: true,
  },
  {
    slug: "hydrafacial-skincare-machine",
    name: "Multifunction Skincare Machine",
    category: "salon-equipment",
    price: 650000,
    image: "/products/skincare-machine.jpg",
    description: "Multi-handpiece facial treatment station with digital touchscreen for professional spas.",
    inStock: true,
    bestSeller: true,
    newArrival: true,
  },
  {
    slug: "three-tier-beauty-cart",
    name: "3-Tier Beauty Trolley",
    category: "salon-equipment",
    price: 32000,
    image: "/products/beauty-cart.jpg",
    description: "Rolling storage trolley that keeps tools and products within reach at every station.",
    inStock: true,
  },
  {
    slug: "practice-mannequin-head",
    name: "Practice Mannequin Head",
    category: "salon-equipment",
    price: 25000,
    image: "/products/mannequin-head.jpg",
    description: "Training head for makeup, lash and skincare practice.",
    inStock: false,
    newArrival: true,
  },
  {
    slug: "professional-hair-styling-kit",
    name: "Professional Hair Styling Kit",
    category: "hair-care",
    price: 55000,
    image: "/products/hair-styling-kit.jpg",
    description: "Blow dryer, straightener, curler, clips and brushes — a complete styling set in one box.",
    inStock: true,
    bestSeller: true,
  },
  {
    slug: "olive-shampoo-conditioner-set",
    name: "Olive Shampoo & Conditioner",
    category: "hair-care",
    price: 30000,
    image: "/products/olive-hair-set.jpg",
    description: "Salon-size olive shampoo and conditioner for nourished, shiny hair.",
    inStock: true,
  },
  {
    slug: "neck-massage-cushion",
    name: "Neck Massage Cushion",
    category: "wellness",
    price: 22000,
    image: "/products/neck-massager.jpg",
    description: "Ergonomic vibrating neck pillow for relaxation on the go.",
    inStock: true,
    newArrival: true,
  },
  {
    slug: "cooling-gel-memory-pillow",
    name: "Cooling Gel Memory Pillow",
    category: "wellness",
    price: 27000,
    image: "/products/gel-pillow.jpg",
    description: "Memory foam pillow with a cooling gel layer for restful sleep.",
    inStock: true,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export const inStock = products.filter((p) => p.inStock);
export const bestSellers = products.filter((p) => p.bestSeller);
export const newArrivals = products.filter((p) => p.newArrival);

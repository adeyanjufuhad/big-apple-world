import "server-only";
import { unstable_cache } from "next/cache";
import { sql } from "./db";
import { PLACEHOLDER_IMAGE, type Catalog, type Category, type Product } from "./products";

export const CATALOG_TAG = "catalog";

type CategoryRow = { slug: string; name: string; image_url: string | null };
type ProductRow = {
  slug: string;
  name: string;
  category: string;
  category_name: string;
  price: number;
  image_url: string | null;
  description: string;
  in_stock: boolean;
  best_seller: boolean;
  new_arrival: boolean;
};

async function loadCatalog(): Promise<Catalog> {
  const [categoryRows, productRows] = (await Promise.all([
    sql`select slug, name, image_url from categories order by sort_order, name`,
    sql`select p.slug, p.name, c.slug as category, c.name as category_name, p.price, p.image_url,
               p.description, p.in_stock, p.best_seller, p.new_arrival
        from products p join categories c on c.id = p.category_id
        where p.published
        order by c.sort_order, p.created_at`,
  ])) as [CategoryRow[], ProductRow[]];

  const categories: Category[] = categoryRows.map((c) => ({ slug: c.slug, name: c.name, image: c.image_url ?? PLACEHOLDER_IMAGE }));
  const products: Product[] = productRows.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryName: p.category_name,
    price: p.price,
    image: p.image_url ?? PLACEHOLDER_IMAGE,
    description: p.description,
    inStock: p.in_stock,
    bestSeller: p.best_seller,
    newArrival: p.new_arrival,
  }));
  return { categories, products };
}

/** Cached for 5 minutes; the admin app refreshes it instantly via /api/revalidate. */
export const getCatalog = unstable_cache(loadCatalog, [CATALOG_TAG], { tags: [CATALOG_TAG], revalidate: 300 });

export async function getProduct(slug: string) {
  const { products } = await getCatalog();
  return products.find((p) => p.slug === slug);
}

export async function getCategory(slug: string) {
  const { categories } = await getCatalog();
  return categories.find((c) => c.slug === slug);
}

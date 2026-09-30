import "server-only";
import { neon } from "@neondatabase/serverless";

// Admin uses the database owner role. Never import this from client components.
export const sql = neon(process.env.DATABASE_URL!);

export type Category = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  product_count: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  category_name: string;
  price: number;
  description: string;
  image_url: string | null;
  in_stock: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  published: boolean;
  updated_at: string;
};

export type OrderItem = { slug: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  ref: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
};

export async function getCategories() {
  return (await sql`
    select c.id, c.slug, c.name, c.image_url, c.sort_order, count(p.id)::int as product_count
    from categories c left join products p on p.category_id = c.id
    group by c.id order by c.sort_order, c.name`) as Category[];
}

export async function getProducts() {
  return (await sql`
    select p.*, c.name as category_name
    from products p join categories c on c.id = p.category_id
    order by p.created_at desc`) as Product[];
}

export async function getProductById(id: string) {
  const rows = (await sql`
    select p.*, c.name as category_name
    from products p join categories c on c.id = p.category_id
    where p.id = ${id}`) as Product[];
  return rows[0];
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

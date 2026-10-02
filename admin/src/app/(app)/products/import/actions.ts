"use server";

import { requireAdmin } from "@/lib/auth/server";
import { parseCsv, truthy } from "@/lib/csv";
import { slugify, sql } from "@/lib/db";
import { refreshStorefront } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";

export type ImportResult = {
  error?: string;
  created?: number;
  newCategories?: string[];
  problems?: { row: number; message: string }[];
} | null;

const MAX_BYTES = 1024 * 1024;
const MAX_ROWS = 500;
type Column = "name" | "category" | "price" | "description" | "in_stock" | "best_seller" | "new_arrival";

export async function importProducts(_prev: ImportResult, formData: FormData): Promise<ImportResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a CSV file to upload." };
  if (file.size > MAX_BYTES) return { error: "That file is over 1 MB. Split it into smaller files." };

  const rows = parseCsv(await file.text());
  if (rows.length < 2) return { error: "The file has no products under the header row." };
  if (rows.length - 1 > MAX_ROWS) return { error: `Import up to ${MAX_ROWS} products at a time.` };

  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const col = (name: Column) => header.indexOf(name);
  if (col("name") < 0 || col("category") < 0 || col("price") < 0) {
    return { error: "The first row must include the columns name, category and price. Download the template to see the format." };
  }

  const categories = (await sql`select id, slug, name from categories`) as { id: string; slug: string; name: string }[];
  const findCategory = (value: string) => {
    const v = value.trim().toLowerCase();
    return categories.find((c) => c.name.toLowerCase() === v || c.slug === v);
  };
  const takenSlugs = new Set(((await sql`select slug from products`) as { slug: string }[]).map((r) => r.slug));
  const uniqueSlug = (base: string) => {
    const root = base || "product";
    let slug = root;
    for (let i = 2; takenSlugs.has(slug); i++) slug = `${root}-${i}`;
    takenSlugs.add(slug);
    return slug;
  };

  const problems: { row: number; message: string }[] = [];
  const newCategories: string[] = [];
  const inserts = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const get = (name: Column) => (col(name) >= 0 ? (cells[col(name)] ?? "").trim() : "");
    const rowNo = i + 1;

    const name = get("name").slice(0, 120);
    const categoryName = get("category").slice(0, 80);
    const price = Number(get("price").replace(/[^\d.]/g, ""));
    if (!name) {
      problems.push({ row: rowNo, message: "Missing product name." });
      continue;
    }
    if (!categoryName) {
      problems.push({ row: rowNo, message: `“${name}”: missing category.` });
      continue;
    }
    if (!get("price") || !Number.isFinite(price) || price < 0 || price > 1_000_000_000) {
      problems.push({ row: rowNo, message: `“${name}”: price must be a number in Naira.` });
      continue;
    }

    let category = findCategory(categoryName);
    if (!category) {
      // Unknown categories are created so the whole sheet can go in at once.
      const slug = slugify(categoryName) || `category-${categories.length + 1}`;
      const [row] = (await sql`
        insert into categories (slug, name, sort_order)
        values (${slug}, ${categoryName}, (select coalesce(max(sort_order), -1) + 1 from categories))
        on conflict (slug) do update set name = categories.name
        returning id, slug, name`) as { id: string; slug: string; name: string }[];
      category = row;
      categories.push(row);
      newCategories.push(row.name);
    }

    inserts.push(sql`
      insert into products (slug, name, category_id, price, description, in_stock, best_seller, new_arrival, published)
      values (${uniqueSlug(slugify(name))}, ${name}, ${category.id}, ${Math.round(price)},
              ${get("description").slice(0, 2000)},
              ${col("in_stock") >= 0 ? truthy(get("in_stock")) : true},
              ${truthy(get("best_seller"))}, ${truthy(get("new_arrival"))}, false)`);
  }

  if (inserts.length > 0) {
    await sql.transaction(inserts);
    revalidatePath("/", "layout");
    await refreshStorefront();
  }

  return { created: inserts.length, newCategories, problems };
}

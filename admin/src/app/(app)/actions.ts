"use server";

import { requireAdmin } from "@/lib/auth/server";
import { isUuid, slugify, sql } from "@/lib/db";
import { refreshStorefront } from "@/lib/revalidate";
import { uploadImage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = { error?: string } | null;

function text(formData: FormData, key: string, max = 2000) {
  return String(formData.get(key) ?? "")
    .trim()
    .slice(0, max);
}

function imageFile(formData: FormData) {
  const file = formData.get("image");
  return file instanceof File && file.size > 0 ? file : null;
}

async function uniqueSlug(table: "products" | "categories", base: string, ignoreId?: string) {
  const root = base || "item";
  for (let i = 1; i < 100; i++) {
    const slug = i === 1 ? root : `${root}-${i}`;
    const rows =
      table === "products"
        ? await sql`select 1 from products where slug = ${slug} and id::text <> ${ignoreId ?? ""}`
        : await sql`select 1 from categories where slug = ${slug} and id::text <> ${ignoreId ?? ""}`;
    if (rows.length === 0) return slug;
  }
  throw new Error("Couldn’t create a unique link for this name.");
}

async function afterCatalogChange() {
  revalidatePath("/", "layout");
  await refreshStorefront();
}

/* ---------------------------------- Orders --------------------------------- */

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!isUuid(id) || !["pending", "paid", "cancelled"].includes(status)) return;
  await sql`update orders set status = ${status}, updated_at = now() where id = ${id}`;
  revalidatePath("/", "layout");
}

/* --------------------------------- Products -------------------------------- */

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name", 120);
  const categoryId = text(formData, "category_id");
  const description = text(formData, "description", 2000);
  const price = Number(text(formData, "price").replace(/[^\d.]/g, ""));
  const flags = {
    inStock: formData.get("in_stock") === "on",
    bestSeller: formData.get("best_seller") === "on",
    newArrival: formData.get("new_arrival") === "on",
    published: formData.get("published") === "on",
  };

  if (!name) return { error: "Give the product a name." };
  if (!isUuid(categoryId)) return { error: "Choose a category." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price in Naira." };

  let imageUrl: string | null = null;
  const file = imageFile(formData);
  try {
    if (file) imageUrl = await uploadImage(file, "products");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  if (id) {
    if (!isUuid(id)) return { error: "Unknown product." };
    await sql`
      update products set
        name = ${name}, category_id = ${categoryId}, price = ${Math.round(price)}, description = ${description},
        image_url = coalesce(${imageUrl}, image_url),
        in_stock = ${flags.inStock}, best_seller = ${flags.bestSeller}, new_arrival = ${flags.newArrival},
        published = ${flags.published}, updated_at = now()
      where id = ${id}`;
  } else {
    if (!imageUrl) return { error: "Add a product photo." };
    const slug = await uniqueSlug("products", slugify(name));
    await sql`
      insert into products (slug, name, category_id, price, description, image_url, in_stock, best_seller, new_arrival, published)
      values (${slug}, ${name}, ${categoryId}, ${Math.round(price)}, ${description}, ${imageUrl},
              ${flags.inStock}, ${flags.bestSeller}, ${flags.newArrival}, ${flags.published})`;
  }

  await afterCatalogChange();
  redirect(`/products?saved=${encodeURIComponent(name)}`);
}

export async function toggleProductStock(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!isUuid(id)) return;
  await sql`update products set in_stock = not in_stock, updated_at = now() where id = ${id}`;
  await afterCatalogChange();
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!isUuid(id)) return;
  await sql`delete from products where id = ${id}`;
  await afterCatalogChange();
  redirect("/products?deleted=1");
}

/* -------------------------------- Categories ------------------------------- */

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name", 80);
  if (!name) return { error: "Give the category a name." };

  let imageUrl: string | null = null;
  const file = imageFile(formData);
  try {
    if (file) imageUrl = await uploadImage(file, "categories");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  if (id) {
    if (!isUuid(id)) return { error: "Unknown category." };
    await sql`update categories set name = ${name}, image_url = coalesce(${imageUrl}, image_url) where id = ${id}`;
  } else {
    const slug = await uniqueSlug("categories", slugify(name));
    await sql`
      insert into categories (slug, name, image_url, sort_order)
      values (${slug}, ${name}, ${imageUrl}, (select coalesce(max(sort_order), -1) + 1 from categories))`;
  }

  await afterCatalogChange();
  redirect(`/categories?saved=${encodeURIComponent(name)}`);
}

export async function moveCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const dir = text(formData, "dir") === "up" ? -1 : 1;
  if (!isUuid(id)) return;
  const rows = (await sql`select id from categories order by sort_order, name`) as { id: string }[];
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await sql.transaction(rows.map((r, index) => sql`update categories set sort_order = ${index} where id = ${r.id}`));
  await afterCatalogChange();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!isUuid(id)) return;
  const [{ n }] = await sql`select count(*)::int as n from products where category_id = ${id}`;
  if (Number(n) > 0) redirect("/categories?error=has-products");
  await sql`delete from categories where id = ${id}`;
  await afterCatalogChange();
  redirect("/categories?deleted=1");
}

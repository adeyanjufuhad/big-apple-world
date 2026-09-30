import { ConfirmButton, Notice } from "@/components/form-bits";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth/server";
import { getCategories } from "@/lib/db";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteCategory, moveCategory } from "../actions";
import { CategoryForm } from "./category-form";

export const metadata = { title: "Categories" };

const iconBtn =
  "grid size-9 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-ink hover:text-white hover:ring-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const { saved, deleted, error } = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <PageHeader title="Categories" description="The order here is the order on the shop’s homepage." />

      {saved && <Notice>Saved “{saved}”. The shop is updated.</Notice>}
      {deleted && <Notice>Category deleted.</Notice>}
      {error === "has-products" && (
        <Notice tone="error">That category still has products. Move or delete them first.</Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="card h-fit divide-y divide-line">
          {categories.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 p-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                {c.image_url && <Image src={c.image_url} alt="" fill sizes="56px" className="object-contain p-1.5 mix-blend-multiply" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.name}</p>
                <p className="text-sm text-muted">
                  {c.product_count} {c.product_count === 1 ? "product" : "products"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button disabled={i === 0} aria-label={`Move ${c.name} up`} className={iconBtn}>
                    <ChevronUp className="size-4" />
                  </button>
                </form>
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button disabled={i === categories.length - 1} aria-label={`Move ${c.name} down`} className={iconBtn}>
                    <ChevronDown className="size-4" />
                  </button>
                </form>
                <Link href={`/categories/${c.id}`} aria-label={`Edit ${c.name}`} className={iconBtn}>
                  <Pencil className="size-4" />
                </Link>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton
                    message={`Delete the “${c.name}” category?`}
                    className={`${iconBtn} text-apple hover:!bg-apple hover:!ring-apple`}
                  >
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
          {categories.length === 0 && <li className="p-8 text-center text-sm text-muted">No categories yet.</li>}
        </ul>

        <div>
          <h2 className="mb-3 font-semibold">Add a category</h2>
          <CategoryForm />
        </div>
      </div>
    </>
  );
}

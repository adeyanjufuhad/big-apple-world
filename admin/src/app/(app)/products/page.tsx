import { Notice } from "@/components/form-bits";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth/server";
import { cn } from "@/lib/cn";
import { getCategories, getProducts } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import { EyeOff, FileSpreadsheet, ImageOff, Pencil, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toggleProductStock } from "../actions";

export const metadata = { title: "Products" };

function Flag({ children, tone }: { children: React.ReactNode; tone: "red" | "navy" | "muted" }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "red" && "bg-apple-soft text-apple",
        tone === "navy" && "bg-navy-soft text-navy",
        tone === "muted" && "bg-sand text-muted",
      )}
    >
      {children}
    </span>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; saved?: string; deleted?: string; filter?: string; page?: string }>;
}) {
  await requireAdmin();
  const { q = "", category = "", saved, deleted, filter, page: pageParam } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const query = q.trim().toLowerCase();
  const shown = products.filter(
    (p) =>
      (!category || p.category_id === category) &&
      (!query || p.name.toLowerCase().includes(query)) &&
      (filter !== "needs-photo" || !p.image_url),
  );

  const PER_PAGE = 50;
  const pageCount = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const page = Math.min(Math.max(Number.parseInt(pageParam ?? "1", 10) || 1, 1), pageCount);
  const pageItems = shown.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pageHref = (n: number) => {
    const qs = new URLSearchParams(
      Object.entries({ q, category, filter, page: String(n) }).filter((e): e is [string, string] => !!e[1]),
    );
    return `/products?${qs}`;
  };

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} products · ${products.filter((p) => p.in_stock).length} in stock`}
        action={
          <div className="flex flex-wrap gap-2">
          <Link
            href="/products/import"
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-line hover:bg-white"
          >
            <FileSpreadsheet className="size-4" /> Import
          </Link>
          <Link
            href="/products/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white hover:bg-navy"
          >
            <Plus className="size-4" /> Add product
          </Link>
          </div>
        }
      />

      {saved && <Notice>Saved “{saved}”. The shop is updated.</Notice>}
      {deleted && <Notice>Product deleted.</Notice>}

      <form className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="Search products" className="field pl-10" />
        </div>
        <select name="category" defaultValue={category} className="field w-auto pr-8">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="h-11 rounded-full px-5 text-sm font-medium ring-1 ring-line hover:bg-white">Filter</button>
      </form>

      {shown.length === 0 ? (
        <div className="card py-16 text-center text-sm text-muted">No products match.</div>
      ) : (
        <ul className="card divide-y divide-line">
          {pageItems.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                {p.image_url && (
                  <Image src={p.image_url} alt="" fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-sm text-muted">
                  {p.category_name} · <span className="font-medium text-ink tabular-nums">{formatNaira(p.price)}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.best_seller && <Flag tone="red">Best seller</Flag>}
                  {p.new_arrival && <Flag tone="navy">New</Flag>}
                  {!p.image_url && (
                    <Flag tone="red">
                      <ImageOff className="mr-1 inline size-3" />
                      Needs photo
                    </Flag>
                  )}
                  {!p.published && (
                    <Flag tone="muted">
                      <EyeOff className="mr-1 inline size-3" />
                      Hidden
                    </Flag>
                  )}
                </div>
              </div>
              <form action={toggleProductStock} className="hidden sm:block">
                <input type="hidden" name="id" value={p.id} />
                <button
                  title="Tap to switch"
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors",
                    p.in_stock
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200 hover:bg-emerald-100"
                      : "bg-sand text-muted ring-line hover:bg-line",
                  )}
                >
                  {p.in_stock ? "In stock" : "Sold out"}
                </button>
              </form>
              <Link
                href={`/products/${p.id}`}
                aria-label={`Edit ${p.name}`}
                className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-white hover:ring-ink"
              >
                <Pencil className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">
            Page {page} of {pageCount} · {shown.length} products
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="rounded-full px-4 py-2 font-medium ring-1 ring-line hover:bg-white">
                Previous
              </Link>
            )}
            {page < pageCount && (
              <Link href={pageHref(page + 1)} className="rounded-full bg-ink px-4 py-2 font-medium text-white hover:bg-navy">
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}

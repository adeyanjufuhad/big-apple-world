import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/auth/server";
import { Download } from "lucide-react";
import { ImportForm } from "./import-form";

export const metadata = { title: "Import products" };

const columns = [
  ["name", "Required", "Product name, e.g. Cordless UV/LED Nail Lamp"],
  ["category", "Required", "An existing category name — or a new one, which is created for you"],
  ["price", "Required", "Price in Naira, numbers only, e.g. 38000"],
  ["description", "Optional", "A sentence or two about the product"],
  ["in_stock", "Optional", "yes or no (yes if left out)"],
  ["best_seller", "Optional", "yes to show it in Best sellers"],
  ["new_arrival", "Optional", "yes to show it in New arrivals"],
];

export default async function ImportPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        title="Import products"
        description="Add many products at once from a spreadsheet. Imported products stay hidden until you add a photo."
        action={
          <a
            href="/product-import-template.csv"
            download
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium ring-1 ring-line hover:bg-white"
          >
            <Download className="size-4" /> Download template
          </a>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <ImportForm />
        <aside className="card h-fit p-5 sm:p-6">
          <h2 className="font-semibold">Spreadsheet columns</h2>
          <p className="mt-1 text-sm text-muted">The first row must have these column names. Order doesn’t matter.</p>
          <dl className="mt-4 space-y-3 text-sm">
            {columns.map(([name, need, help]) => (
              <div key={name}>
                <dt className="flex items-center gap-2">
                  <code className="rounded bg-sand px-1.5 py-0.5 text-xs">{name}</code>
                  <span className={need === "Required" ? "text-xs text-apple" : "text-xs text-muted"}>{need}</span>
                </dt>
                <dd className="mt-0.5 text-muted">{help}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </>
  );
}

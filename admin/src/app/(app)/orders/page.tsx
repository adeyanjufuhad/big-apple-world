import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth/server";
import { cn } from "@/lib/cn";
import { sql, type Order } from "@/lib/db";
import { formatDateTime, formatNaira } from "@/lib/format";
import { Check, RotateCcw, Search, X } from "lucide-react";
import Link from "next/link";
import { setOrderStatus } from "../actions";

export const metadata = { title: "Orders" };

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status = "all", q = "" } = await searchParams;
  const tab = TABS.some((t) => t.key === status) ? status : "all";
  const query = q.trim().toUpperCase();

  const [orderRows, counts] = await Promise.all([
    sql`
      select id, ref, items, total, status, created_at from orders
      where (${tab} = 'all' or status = ${tab})
        and (${query} = '' or ref ilike ${"%" + query + "%"})
      order by created_at desc limit 200`,
    sql`select status, count(*)::int as n from orders group by status`,
  ]);
  const orders = orderRows as Order[];
  const countOf = (key: string) =>
    key === "all" ? counts.reduce((s, c) => s + Number(c.n), 0) : Number(counts.find((c) => c.status === key)?.n ?? 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every “Checkout on WhatsApp” is saved here. Match the reference in the customer’s message, then mark it paid or cancelled."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-line">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.key === "all" ? "/orders" : `/orders?status=${t.key}`}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm whitespace-nowrap",
                tab === t.key ? "bg-ink text-white" : "text-muted hover:text-ink",
              )}
            >
              {t.label}
              <span className={cn("text-xs tabular-nums", tab === t.key ? "text-white/70" : "text-muted")}>{countOf(t.key)}</span>
            </Link>
          ))}
        </div>
        <form className="relative w-full sm:w-64">
          {tab !== "all" && <input type="hidden" name="status" value={tab} />}
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="Find by ref, e.g. BA-7K2QXM" className="field pl-10" />
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="font-medium">No orders here yet</p>
          <p className="mt-1 text-sm text-muted">Orders appear when customers tap “Checkout on WhatsApp” in the shop.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-lg font-semibold tracking-tight">{o.ref}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{formatDateTime(o.created_at)}</p>
                </div>
                <p className="text-xl font-semibold tabular-nums">{formatNaira(o.total)}</p>
              </div>

              <ul className="mt-4 divide-y divide-line rounded-xl bg-sand/60 px-4 text-sm">
                {o.items.map((item) => (
                  <li key={item.slug} className="flex justify-between gap-3 py-2.5">
                    <span>
                      {item.name} <span className="text-muted">× {item.qty}</span>
                    </span>
                    <span className="tabular-nums">{formatNaira(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {o.status !== "paid" && (
                  <form action={setOrderStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value="paid" />
                    <button className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
                      <Check className="size-4" /> Mark as paid
                    </button>
                  </form>
                )}
                {o.status === "pending" && (
                  <form action={setOrderStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-sand">
                      <X className="size-4" /> Cancel
                    </button>
                  </form>
                )}
                {o.status !== "pending" && (
                  <form action={setOrderStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value="pending" />
                    <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted ring-1 ring-line hover:bg-sand hover:text-ink">
                      <RotateCcw className="size-4" /> Move back to pending
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

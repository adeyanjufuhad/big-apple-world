import { RevenueChart, VisitorsChart } from "@/components/charts";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth/server";
import { cn } from "@/lib/cn";
import { change, formatCount, formatDateTime, formatDay, formatNaira } from "@/lib/format";
import { getDashboard } from "@/lib/stats";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

const RANGES = [7, 30, 90] as const;

function greeting() {
  const hour = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function Delta({ current, previous, days }: { current: number; previous: number; days: number }) {
  const pct = change(current, previous);
  if (pct === null) return <p className="mt-2 text-xs text-muted">New this period</p>;
  const Icon = pct > 0 ? ArrowUpRight : pct < 0 ? ArrowDownRight : Minus;
  return (
    <p className="mt-2 flex items-center gap-1 text-xs text-muted">
      <Icon className={cn("size-3.5", pct > 0 ? "text-emerald-600" : pct < 0 ? "text-apple" : "text-muted")} />
      <span className="font-medium text-ink">{pct > 0 ? `+${pct}` : pct}%</span> vs previous {days} days
    </p>
  );
}

function Stat({ label, value, children, accent }: { label: string; value: string; children?: React.ReactNode; accent?: boolean }) {
  return (
    <div className={cn("card p-5", accent && "bg-navy text-white shadow-none")}>
      <p className={cn("text-sm", accent ? "text-white/70" : "text-muted")}>{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {children}
    </div>
  );
}

function Card({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card p-5 sm:p-6", className)}>
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Bar-in-row list: a direct-labeled horizontal bar per item. */
function BarList({ rows, empty }: { rows: { label: string; value: number; note?: string }[]; empty: string }) {
  if (rows.length === 0 || rows.every((r) => r.value === 0)) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 font-medium tabular-nums">
              {formatCount(r.value)}
              {r.note && <span className="ml-1.5 font-normal text-muted">{r.note}</span>}
            </span>
          </div>
          <div className="h-2 rounded-full bg-sand">
            <div className="h-2 rounded-full bg-[#4a4bab]" style={{ width: `${Math.max((r.value / max) * 100, 2)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const user = await requireAdmin();
  const { range } = await searchParams;
  const days = RANGES.find((r) => String(r) === range) ?? 30;
  const d = await getDashboard(days);
  const { kpis } = d;
  const conversion = kpis.visitors ? ((kpis.checkouts / kpis.visitors) * 100).toFixed(1) : "0.0";
  const firstName = (user.name || "").split(" ")[0];
  const revenueChange = change(kpis.revenue, kpis.revenuePrev);

  return (
    <>
      <PageHeader
        title={`${greeting()}${firstName ? `, ${firstName}` : ""}`}
        description={`Here’s how Big Apple Beauty did in the last ${days} days.`}
        action={
          <div className="flex rounded-full bg-white p-1 ring-1 ring-line" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/?range=${r}`}
                aria-current={r === days ? "true" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  r === days ? "bg-ink text-white" : "text-muted hover:text-ink",
                )}
              >
                {r} days
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Revenue (paid orders)" value={formatNaira(kpis.revenue)} accent>
          <p className="mt-2 text-xs text-white/70">
            {kpis.paidOrders} paid {kpis.paidOrders === 1 ? "order" : "orders"}
            {revenueChange !== null && ` · ${revenueChange > 0 ? "+" : ""}${revenueChange}% vs previous ${days} days`}
          </p>
        </Stat>
        <Stat label="Ready to buy (pending)" value={formatCount(kpis.pendingOrders)}>
          <p className="mt-2 text-xs text-muted">
            Worth <span className="font-medium text-ink">{formatNaira(kpis.pendingValue)}</span> ·{" "}
            <Link href="/orders?status=pending" className="text-navy hover:underline">
              follow up
            </Link>
          </p>
        </Stat>
        <Stat label="Visitors" value={formatCount(kpis.visitors)}>
          <Delta current={kpis.visitors} previous={kpis.visitorsPrev} days={days} />
        </Stat>
        <Stat label="Orders sent on WhatsApp" value={formatCount(kpis.checkouts)}>
          <p className="mt-2 text-xs text-muted">
            <span className="font-medium text-ink">{conversion}%</span> of visitors checked out
          </p>
        </Stat>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Revenue" subtitle="Paid orders per day" className="lg:col-span-2">
          <RevenueChart data={d.series} />
        </Card>
        <Card title="From visit to sale" subtitle="How many people reached each step">
          <BarList
            rows={d.funnel.map((f, i) => ({
              label: f.label,
              value: f.value,
              note: i > 0 && d.funnel[0].value ? `${Math.round((f.value / d.funnel[0].value) * 100)}%` : undefined,
            }))}
            empty="No visits yet — share your shop link to get started."
          />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Visitors" subtitle={`${formatCount(kpis.views)} page views in total`} className="lg:col-span-2">
          <VisitorsChart data={d.series} />
        </Card>
        <Card title="Where visitors come from">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">Device</p>
          <BarList
            rows={d.devices.map((x) => ({ label: x.device.charAt(0).toUpperCase() + x.device.slice(1), value: x.visitors }))}
            empty="No visitors yet."
          />
          <p className="mt-6 mb-2 text-xs font-medium tracking-wide text-muted uppercase">Top referring sites</p>
          <BarList
            rows={d.referrers.map((x) => ({ label: x.host, value: x.visitors }))}
            empty="Mostly direct visits so far."
          />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Most wanted products" subtitle="Times added to cart">
          <BarList
            rows={d.topProducts.map((p) => ({ label: p.name, value: p.carts, note: `${formatCount(p.views)} views` }))}
            empty="No products added to cart yet."
          />
        </Card>
        <Card title="Latest orders">
          {d.recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No orders yet. When a customer taps “Checkout on WhatsApp”, it appears here.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {d.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{o.ref}</p>
                    <p className="truncate text-xs text-muted">
                      {formatDateTime(o.created_at)} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatNaira(o.total)}</span>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
          <Link href="/orders" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:underline">
            All orders <ArrowRight className="size-4" />
          </Link>
        </Card>
      </div>

      <details className="card mt-4 p-5 sm:p-6">
        <summary className="cursor-pointer text-sm font-medium">View daily numbers as a table</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="py-2 font-medium">Day</th>
                <th className="py-2 text-right font-medium">Visitors</th>
                <th className="py-2 text-right font-medium">Page views</th>
                <th className="py-2 text-right font-medium">Paid orders</th>
                <th className="py-2 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line tabular-nums">
              {[...d.series].reverse().map((p) => (
                <tr key={p.day}>
                  <td className="py-2">{formatDay(p.day)}</td>
                  <td className="py-2 text-right">{formatCount(p.visitors)}</td>
                  <td className="py-2 text-right">{formatCount(p.views)}</td>
                  <td className="py-2 text-right">{p.paidOrders}</td>
                  <td className="py-2 text-right">{formatNaira(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

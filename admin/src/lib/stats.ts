import { sql, type Order } from "./db";

const TZ = "Africa/Lagos";

export type DayPoint = { day: string; revenue: number; paidOrders: number; visitors: number; views: number };

export type Dashboard = {
  days: number;
  kpis: {
    revenue: number;
    revenuePrev: number;
    paidOrders: number;
    paidOrdersPrev: number;
    pendingOrders: number;
    pendingValue: number;
    visitors: number;
    visitorsPrev: number;
    views: number;
    checkouts: number;
    checkoutsPrev: number;
  };
  series: DayPoint[];
  funnel: { label: string; value: number }[];
  topProducts: { slug: string; name: string; carts: number; views: number }[];
  devices: { device: string; visitors: number }[];
  referrers: { host: string; visitors: number }[];
  recentOrders: Order[];
};

export async function getDashboard(days: number): Promise<Dashboard> {
  const [kpiRows, series, funnelRows, topProducts, devices, referrers, recentOrders] = await Promise.all([
    sql`
      with cur as (select now() - make_interval(days => ${days}) as since),
           prev as (select now() - make_interval(days => ${days * 2}) as since)
      select
        (select coalesce(sum(total), 0)::bigint from orders, cur where status = 'paid' and created_at >= cur.since) as revenue,
        (select coalesce(sum(total), 0)::bigint from orders, cur, prev where status = 'paid' and created_at >= prev.since and created_at < cur.since) as revenue_prev,
        (select count(*)::int from orders, cur where status = 'paid' and created_at >= cur.since) as paid_orders,
        (select count(*)::int from orders, cur, prev where status = 'paid' and created_at >= prev.since and created_at < cur.since) as paid_orders_prev,
        (select count(*)::int from orders, cur where status = 'pending' and created_at >= cur.since) as pending_orders,
        (select coalesce(sum(total), 0)::bigint from orders, cur where status = 'pending' and created_at >= cur.since) as pending_value,
        (select count(distinct visitor_id)::int from events, cur where type = 'page_view' and created_at >= cur.since) as visitors,
        (select count(distinct visitor_id)::int from events, cur, prev where type = 'page_view' and created_at >= prev.since and created_at < cur.since) as visitors_prev,
        (select count(*)::int from events, cur where type = 'page_view' and created_at >= cur.since) as views,
        (select count(*)::int from orders, cur where created_at >= cur.since) as checkouts,
        (select count(*)::int from orders, cur, prev where created_at >= prev.since and created_at < cur.since) as checkouts_prev`,
    sql`
      with d as (
        select generate_series(
          (now() at time zone ${TZ})::date - (${days} - 1),
          (now() at time zone ${TZ})::date,
          interval '1 day')::date as day
      )
      select to_char(d.day, 'YYYY-MM-DD') as day,
        coalesce((select sum(total) from orders o where o.status = 'paid' and (o.created_at at time zone ${TZ})::date = d.day), 0)::bigint as revenue,
        (select count(*) from orders o where o.status = 'paid' and (o.created_at at time zone ${TZ})::date = d.day)::int as paid_orders,
        (select count(distinct visitor_id) from events e where e.type = 'page_view' and (e.created_at at time zone ${TZ})::date = d.day)::int as visitors,
        (select count(*) from events e where e.type = 'page_view' and (e.created_at at time zone ${TZ})::date = d.day)::int as views
      from d order by d.day`,
    sql`
      with since as (select now() - make_interval(days => ${days}) as t)
      select
        (select count(distinct visitor_id) from events, since where type = 'page_view' and created_at >= since.t)::int as visitors,
        (select count(distinct visitor_id) from events, since where type = 'product_view' and created_at >= since.t)::int as viewed,
        (select count(distinct visitor_id) from events, since where type = 'add_to_cart' and created_at >= since.t)::int as carted,
        (select count(distinct visitor_id) from orders, since where created_at >= since.t)::int as checked_out,
        (select count(*) from orders, since where status = 'paid' and created_at >= since.t)::int as paid`,
    sql`
      select e.product_slug as slug, coalesce(p.name, e.product_slug) as name,
        count(*) filter (where e.type = 'add_to_cart')::int as carts,
        count(*) filter (where e.type = 'product_view')::int as views
      from events e left join products p on p.slug = e.product_slug
      where e.product_slug is not null and e.created_at >= now() - make_interval(days => ${days})
      group by e.product_slug, p.name
      order by carts desc, views desc
      limit 6`,
    sql`
      select coalesce(device, 'unknown') as device, count(distinct visitor_id)::int as visitors
      from events where type = 'page_view' and created_at >= now() - make_interval(days => ${days})
      group by 1 order by 2 desc`,
    sql`
      select referrer as host, count(distinct visitor_id)::int as visitors
      from events where type = 'page_view' and referrer is not null and created_at >= now() - make_interval(days => ${days})
      group by 1 order by 2 desc limit 5`,
    sql`select id, ref, items, total, status, created_at from orders order by created_at desc limit 6`,
  ]);

  const k = kpiRows[0];
  const f = funnelRows[0];
  const n = (v: unknown) => Number(v ?? 0);

  return {
    days,
    kpis: {
      revenue: n(k.revenue),
      revenuePrev: n(k.revenue_prev),
      paidOrders: n(k.paid_orders),
      paidOrdersPrev: n(k.paid_orders_prev),
      pendingOrders: n(k.pending_orders),
      pendingValue: n(k.pending_value),
      visitors: n(k.visitors),
      visitorsPrev: n(k.visitors_prev),
      views: n(k.views),
      checkouts: n(k.checkouts),
      checkoutsPrev: n(k.checkouts_prev),
    },
    series: series.map((r) => ({
      day: r.day,
      revenue: n(r.revenue),
      paidOrders: n(r.paid_orders),
      visitors: n(r.visitors),
      views: n(r.views),
    })),
    funnel: [
      { label: "Visited the shop", value: n(f.visitors) },
      { label: "Viewed a product", value: n(f.viewed) },
      { label: "Added to cart", value: n(f.carted) },
      { label: "Sent order on WhatsApp", value: n(f.checked_out) },
      { label: "Paid", value: n(f.paid) },
    ],
    topProducts: topProducts as Dashboard["topProducts"],
    devices: devices as Dashboard["devices"],
    referrers: referrers as Dashboard["referrers"],
    recentOrders: recentOrders as Order[],
  };
}

export async function getPendingCount() {
  const [row] = await sql`select count(*)::int as n from orders where status = 'pending'`;
  return Number(row.n);
}

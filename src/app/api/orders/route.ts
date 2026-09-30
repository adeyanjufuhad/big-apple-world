import { sql } from "@/lib/db";

type Row = { slug: string; name: string; price: number };

// Records a WhatsApp checkout as a pending order. Prices come from the database,
// never from the browser, so totals in the admin can't be spoofed.
export async function POST(req: Request) {
  let body: { ref?: unknown; visitorId?: unknown; items?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ref = typeof body.ref === "string" && /^BA-[A-Z0-9]{6}$/.test(body.ref) ? body.ref : null;
  const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : null;
  const raw = Array.isArray(body.items) ? body.items.slice(0, 50) : [];

  const wanted = new Map<string, number>();
  for (const item of raw) {
    const slug = typeof item?.slug === "string" ? item.slug.slice(0, 120) : null;
    const qty = Number.isInteger(item?.qty) ? Math.min(Math.max(item.qty, 1), 999) : 0;
    if (slug && qty) wanted.set(slug, (wanted.get(slug) ?? 0) + qty);
  }
  if (!ref || wanted.size === 0) return Response.json({ error: "Invalid order" }, { status: 400 });

  const rows = (await sql`select slug, name, price from products
                          where published and slug = any(${[...wanted.keys()]})`) as Row[];
  if (rows.length === 0) return Response.json({ error: "No valid products" }, { status: 400 });

  const items = rows.map((r) => ({ slug: r.slug, name: r.name, price: r.price, qty: wanted.get(r.slug)! }));
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  try {
    await sql.transaction([
      sql`insert into orders (ref, items, total, visitor_id) values (${ref}, ${JSON.stringify(items)}::jsonb, ${total}, ${visitorId})`,
      sql`insert into events (type, visitor_id, path) values ('checkout', ${visitorId ?? "unknown"}, '/checkout')`,
    ]);
  } catch (err) {
    // Duplicate ref (a retried request) is fine to ignore.
    if (String(err).includes("orders_ref_key")) return Response.json({ ok: true });
    throw err;
  }

  return Response.json({ ok: true });
}

import { sql } from "@/lib/db";
import { allowRequest, clientIp, readJson } from "@/lib/security";
import { checkBotId } from "botid/server";

type Row = { slug: string; name: string; price: number };

const fail = (status: number) => Response.json({ ok: false }, { status });

// Records a WhatsApp checkout as a pending order. The customer's WhatsApp chat opens
// in the browser before this runs, so a rejected request never blocks a real sale.
// Prices come from the database, never from the browser.
export async function POST(req: Request) {
  if ((await checkBotId()).isBot) return fail(403);

  const body = await readJson(req, 16_384);
  if (!body) return fail(400);

  const ref = typeof body.ref === "string" && /^BA-[A-Z0-9]{6}$/.test(body.ref) ? body.ref : null;
  const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : null;
  const raw = Array.isArray(body.items) ? body.items.slice(0, 50) : [];

  const wanted = new Map<string, number>();
  for (const item of raw) {
    const slug = typeof item?.slug === "string" && /^[a-z0-9-]{1,120}$/.test(item.slug) ? item.slug : null;
    const qty = Number.isInteger(item?.qty) ? Math.min(Math.max(item.qty, 1), 999) : 0;
    if (slug && qty) wanted.set(slug, (wanted.get(slug) ?? 0) + qty);
  }
  if (!ref || wanted.size === 0) return fail(400);

  // 10 checkouts per 10 minutes per IP.
  if (!(await allowRequest("order", clientIp(req), 600, 10))) return fail(429);

  const rows = (await sql`select slug, name, price from products where published and slug = any(${[...wanted.keys()]})`) as Row[];
  if (rows.length === 0) return fail(400);

  const items = rows.map((r) => ({ slug: r.slug, name: r.name, price: r.price, qty: wanted.get(r.slug)! }));
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  try {
    await sql.transaction([
      sql`insert into orders (ref, items, total, visitor_id) values (${ref}, ${JSON.stringify(items)}::jsonb, ${total}, ${visitorId})`,
      sql`insert into events (type, visitor_id, path) values ('checkout', ${visitorId ?? "unknown"}, '/checkout')`,
    ]);
  } catch (err) {
    // Duplicate ref (a retried request) is fine to ignore.
    if (!String(err).includes("orders_ref_key")) throw err;
  }

  return Response.json({ ok: true });
}

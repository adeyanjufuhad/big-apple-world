import { sql } from "@/lib/db";
import { allowRequest, clientIp, readJson } from "@/lib/security";

const TYPES = new Set(["page_view", "product_view", "add_to_cart", "whatsapp_click"]);

function str(v: unknown, max: number) {
  return typeof v === "string" && v.length > 0 ? v.slice(0, max) : null;
}

function deviceFrom(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

function isBotAgent(ua: string) {
  return !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(ua);
}

const done = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (isBotAgent(ua)) return done();

  const body = await readJson(req, 2048);
  const type = str(body?.type, 32);
  const visitorId = str(body?.visitorId, 64);
  if (!body || !type || !TYPES.has(type) || !visitorId) return new Response(null, { status: 400 });

  // 120 events per minute per IP is plenty for a person browsing.
  if (!(await allowRequest("track", clientIp(req), 60, 120))) return new Response(null, { status: 429 });

  // Keep only the referring site's host, and ignore internal navigation.
  let referrer: string | null = null;
  const ref = str(body.referrer, 500);
  if (ref) {
    try {
      const host = new URL(ref).host;
      if (host !== new URL(req.url).host) referrer = host.slice(0, 120);
    } catch {}
  }

  await sql`insert into events (type, visitor_id, path, product_slug, referrer, device, country)
            values (${type}, ${visitorId}, ${str(body.path, 300)}, ${str(body.productSlug, 120)},
                    ${referrer}, ${deviceFrom(ua)}, ${str(req.headers.get("cf-ipcountry"), 2)})`;

  return done();
}

import { sql } from "@/lib/db";

const TYPES = new Set(["page_view", "product_view", "add_to_cart", "whatsapp_click"]);

function str(v: unknown, max: number) {
  return typeof v === "string" && v.length > 0 ? v.slice(0, max) : null;
}

function deviceFrom(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

function isBot(ua: string) {
  return !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(ua);
}

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = str(body.type, 32);
  const visitorId = str(body.visitorId, 64);
  if (!type || !TYPES.has(type) || !visitorId) return new Response(null, { status: 400 });

  // Keep only the referring site's host, and ignore internal navigation.
  let referrer: string | null = null;
  const ref = str(body.referrer, 500);
  if (ref) {
    try {
      const host = new URL(ref).host;
      if (host !== new URL(req.url).host) referrer = host;
    } catch {}
  }

  await sql`insert into events (type, visitor_id, path, product_slug, referrer, device, country)
            values (${type}, ${visitorId}, ${str(body.path, 300)}, ${str(body.productSlug, 120)},
                    ${referrer}, ${deviceFrom(ua)}, ${req.headers.get("x-vercel-ip-country")})`;

  return new Response(null, { status: 204 });
}

import "server-only";
import { createHmac } from "node:crypto";
import { sql } from "./db";

export function clientIp(req: Request) {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Keyed hash so rate-limit rows never contain a raw IP address. */
function hashId(value: string) {
  return createHmac("sha256", process.env.RATE_LIMIT_SECRET ?? "dev-only")
    .update(value)
    .digest("base64url")
    .slice(0, 32);
}

/** Fixed-window rate limit backed by the hit_rate_limit() database function. */
export async function allowRequest(scope: string, id: string, windowSeconds: number, max: number) {
  const [row] = await sql`select hit_rate_limit(${`${scope}:${hashId(id)}`}, ${windowSeconds}, ${max}) as ok`;
  return row?.ok === true;
}

/** Parses a JSON body, refusing anything larger than maxBytes. Returns null when invalid. */
export async function readJson(req: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return null;
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

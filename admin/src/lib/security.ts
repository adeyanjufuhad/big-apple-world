import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { sql } from "./db";

export async function requestIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Keyed hash so rate-limit rows never contain a raw IP address or email. */
function hashId(value: string) {
  return createHmac("sha256", process.env.RATE_LIMIT_SECRET ?? "dev-only")
    .update(value.toLowerCase())
    .digest("base64url")
    .slice(0, 32);
}

/** Fixed-window rate limit backed by the hit_rate_limit() database function. */
export async function allowAttempt(scope: string, id: string, windowSeconds: number, max: number) {
  const [row] = await sql`select hit_rate_limit(${`${scope}:${hashId(id)}`}, ${windowSeconds}, ${max}) as ok`;
  return row?.ok === true;
}

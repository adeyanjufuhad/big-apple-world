import { createNeonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

/** Emails allowed into the admin, from ADMIN_EMAILS (comma-separated). */
export function isAllowedEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

/**
 * Every admin page and server action calls this. Signing in isn't enough —
 * the account's email must also be on the ADMIN_EMAILS allowlist.
 */
export async function requireAdmin() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");
  if (!isAllowedEmail(session.user.email)) redirect("/login?error=not-allowed");
  return session.user;
}

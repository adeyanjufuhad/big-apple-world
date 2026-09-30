/** Tells the storefront to refresh its cached catalog. Failures don't block the admin (the shop self-refreshes every 5 min). */
export async function refreshStorefront() {
  const url = process.env.STOREFRONT_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(`${url.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      cache: "no-store",
    });
  } catch (err) {
    console.warn("Storefront refresh failed:", err);
  }
}

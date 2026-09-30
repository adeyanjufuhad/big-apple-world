// Anonymous, first-party analytics. A random visitor id lives in localStorage;
// no names, emails or IP addresses are collected.

export type TrackType = "page_view" | "product_view" | "add_to_cart" | "whatsapp_click";

const KEY = "baw-vid";
let memoryId: string | null = null;

export function getVisitorId() {
  if (memoryId) return memoryId;
  try {
    memoryId = localStorage.getItem(KEY);
    if (!memoryId) {
      memoryId = crypto.randomUUID();
      localStorage.setItem(KEY, memoryId);
    }
  } catch {
    memoryId ??= crypto.randomUUID();
  }
  return memoryId;
}

export function track(type: TrackType, data: { path?: string; productSlug?: string } = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    type,
    visitorId: getVisitorId(),
    path: data.path ?? location.pathname,
    productSlug: data.productSlug,
    referrer: document.referrer || undefined,
  });
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(
    () => {},
  );
}

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Short, human-friendly order reference, e.g. BA-7K2QXM. */
export function newOrderRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "BA-" + Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
}

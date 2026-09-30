const TZ = "Africa/Lagos";

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const nairaCompact = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  notation: "compact",
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat("en-NG");

export const formatNaira = (v: number) => naira.format(v);
export const formatNairaCompact = (v: number) => nairaCompact.format(v);
export const formatCount = (v: number) => count.format(v);

export function formatDay(isoDay: string) {
  // isoDay is YYYY-MM-DD already in Lagos time.
  const [y, m, d] = isoDay.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export function formatDateTime(value: string | Date) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

/** Percentage change vs the previous period; null when there's nothing to compare. */
export function change(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

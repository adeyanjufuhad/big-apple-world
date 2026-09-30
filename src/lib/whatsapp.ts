import { site } from "./site";
import { formatPrice } from "./utils";
import type { Product } from "./products";

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type OrderLine = { product: Product; qty: number };

export function orderMessage(lines: OrderLine[], ref?: string) {
  const items = lines.map(
    ({ product, qty }, i) => `${i + 1}. ${product.name} × ${qty} — ${formatPrice(product.price * qty)}`,
  );
  const total = lines.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  return [
    `Hello ${site.name}, I'd like to place an order:`,
    ...(ref ? [`Order ref: ${ref}`] : []),
    "",
    ...items,
    "",
    `Estimated total: ${formatPrice(total)}`,
    "",
    "Name:",
    "Delivery / pickup:",
  ].join("\n");
}

export function productEnquiry(product: Product, qty = 1) {
  return `Hello ${site.name}, I'm interested in ${product.name} (× ${qty}). Is it available?`;
}

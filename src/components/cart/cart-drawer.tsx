"use client";

import { buttonClass } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { getVisitorId, newOrderRef } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { CheckCircle2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { open, setOpen, lines, count, total, setQty, remove, clear } = useCart();
  const [sent, setSent] = useState<{ ref: string; url: string } | null>(null);

  const close = () => {
    setOpen(false);
    setSent(null);
  };

  // Opens WhatsApp with the order, records it as a pending order for the owner, then empties the cart.
  const checkout = (e: React.MouseEvent) => {
    e.preventDefault();
    const ref = newOrderRef();
    const url = whatsappLink(orderMessage(lines, ref));
    window.open(url, "_blank", "noopener,noreferrer");
    fetch("/api/orders", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ref,
        visitorId: getVisitorId(),
        items: lines.map(({ product, qty }) => ({ slug: product.slug, qty })),
      }),
    }).catch(() => {});
    setSent({ ref, url });
    clear();
  };

  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    // Pause smooth page scrolling so the page behind the drawer stays put.
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSent(null);
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, setOpen, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-lg font-semibold">
                Your cart <span className="font-normal text-muted">({count})</span>
              </h2>
              <button
                onClick={close}
                className={buttonClass("ghost", "icon")}
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </header>

            {sent ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="size-8 text-emerald-600" />
                </span>
                <h3 className="text-xl font-semibold">Order sent to WhatsApp</h3>
                <p className="text-muted">
                  Your order reference is <strong className="font-semibold text-ink">{sent.ref}</strong>. Send the
                  message in WhatsApp and we&apos;ll confirm availability, price and delivery.
                </p>
                <a
                  href={sent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-checkout
                  className={buttonClass("outline", "md")}
                >
                  <WhatsAppIcon className="size-4.5 text-[#25D366]" />
                  WhatsApp didn&apos;t open? Tap here
                </a>
                <button onClick={close} className="text-sm font-medium text-navy hover:underline">
                  Continue shopping
                </button>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-sand">
                  <ShoppingBag className="size-7 text-muted" />
                </span>
                <p className="text-muted">Your cart is empty.</p>
                <Link href="/shop" onClick={close} className={buttonClass("primary")}>
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {lines.map(({ product, qty }) => (
                    <li key={product.slug} className="flex gap-4 py-5">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1.5 mix-blend-multiply"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm leading-snug font-medium hover:underline"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => remove(product.slug)}
                            className="text-muted transition-colors hover:text-apple"
                            aria-label={`Remove ${product.name}`}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-muted">{formatPrice(product.price)}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              onClick={() => setQty(product.slug, qty - 1)}
                              className="grid size-8 place-items-center text-muted hover:text-ink"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm tabular-nums">{qty}</span>
                            <button
                              onClick={() => setQty(product.slug, qty + 1)}
                              className="grid size-8 place-items-center text-muted hover:text-ink"
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold tabular-nums">
                            {formatPrice(product.price * qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="space-y-4 border-t border-line px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted">Estimated total</span>
                    <span className="text-xl font-semibold tabular-nums">{formatPrice(total)}</span>
                  </div>
                  <a
                    href={whatsappLink(orderMessage(lines))}
                    onClick={checkout}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-checkout
                    className={buttonClass("whatsapp", "lg", "w-full")}
                  >
                    <WhatsAppIcon className="size-5" />
                    Checkout on WhatsApp
                  </a>
                  <p className="text-center text-xs text-muted">
                    Your order opens in WhatsApp. We&apos;ll confirm availability, final price and delivery with you.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

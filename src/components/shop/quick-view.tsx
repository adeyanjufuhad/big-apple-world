"use client";

import type { Product } from "@/lib/products";
import { useIsClient } from "@/lib/use-is-client";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Check, Eye, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ProductPurchase } from "./product-purchase";

export function QuickViewButton({ product, className }: { product: Product; className?: string }) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();

  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Quick view ${product.name}`}
        title="Quick view"
        className={className}
      >
        <Eye className="size-4" />
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[60] grid place-items-center p-4">
                <motion.div
                  className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={product.name}
                  data-lenis-prevent
                  className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl md:grid-cols-2"
                  initial={{ opacity: 0, y: 32, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ type: "spring", damping: 30, stiffness: 320 }}
                >
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-white ring-1 ring-line hover:bg-ink hover:text-white"
                  >
                    <X className="size-4.5" />
                  </button>
                  <div className="relative aspect-square bg-sand md:aspect-auto md:min-h-[480px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 768px) 448px, 100vw"
                      className="object-contain p-10 mix-blend-multiply"
                    />
                  </div>
                  <div className="flex flex-col p-7 md:p-9">
                    <span className="w-fit rounded-full px-3 py-1 text-xs ring-1 ring-line">
                      {product.categoryName}
                    </span>
                    <h2 className="mt-4 text-3xl leading-tight font-medium tracking-tight">{product.name}</h2>
                    <p className="mt-3 text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
                      {product.inStock ? (
                        <>
                          <Check className="size-4 text-emerald-600" /> In stock
                        </>
                      ) : (
                        "Sold out"
                      )}
                    </p>
                    <p className="mt-5 leading-relaxed text-muted">{product.description}</p>
                    <div className="mt-auto pt-8">
                      <ProductPurchase product={product} onAdded={() => setOpen(false)} />
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy"
                      >
                        View full details
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

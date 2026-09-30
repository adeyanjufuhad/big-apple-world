"use client";

import { AddToCartButton } from "@/components/cart/add-to-cart";
import { WhatsAppIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { productEnquiry, whatsappLink } from "@/lib/whatsapp";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-8 space-y-3">
      {product.inStock && (
        <div className="flex gap-3">
          <div className="flex h-12 items-center rounded-full border border-line bg-white">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-12 place-items-center text-muted hover:text-ink"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid size-12 place-items-center text-muted hover:text-ink"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <AddToCartButton product={product} qty={qty} size="lg" className="flex-1" />
        </div>
      )}
      <a
        href={whatsappLink(productEnquiry(product, qty))}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(product.inStock ? "outline" : "whatsapp", "lg", "w-full")}
      >
        <WhatsAppIcon className={product.inStock ? "size-4.5 text-[#25D366]" : "size-5"} />
        {product.inStock ? "Ask about this product" : "Ask about restock"}
      </a>
    </div>
  );
}

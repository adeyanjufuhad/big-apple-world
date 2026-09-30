"use client";

import { AddToCartButton } from "@/components/cart/add-to-cart";
import { WhatsAppIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { productEnquiry, whatsappLink } from "@/lib/whatsapp";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function ProductPurchase({ product, onAdded }: { product: Product; onAdded?: () => void }) {
  const [qty, setQty] = useState(1);
  const enquiry = whatsappLink(productEnquiry(product, qty));

  if (!product.inStock) {
    return (
      <a href={enquiry} target="_blank" rel="noopener noreferrer" className={buttonClass("whatsapp", "lg", "w-full")}>
        <WhatsAppIcon className="size-5" />
        Ask about restock
      </a>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="flex h-12 items-center rounded-full bg-sand">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="grid size-12 place-items-center text-muted hover:text-ink"
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center font-medium tabular-nums" aria-live="polite">
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
      <AddToCartButton product={product} qty={qty} size="lg" className="flex-1" onAdded={onAdded} />
      <a
        href={enquiry}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ask about this product on WhatsApp"
        title="Ask on WhatsApp"
        className="grid size-12 shrink-0 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-[#25D366] hover:text-white hover:ring-[#25D366]"
      >
        <WhatsAppIcon className="size-5" />
      </a>
    </div>
  );
}

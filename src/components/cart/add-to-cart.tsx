"use client";

import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { Plus, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  product,
  qty = 1,
  variant = "ink",
  size = "md",
  className,
  label = "Add to cart",
  onAdded,
}: {
  product: Product;
  qty?: number;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
  onAdded?: () => void;
}) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        add(product, qty);
        onAdded?.();
      }}
      className={buttonClass(variant, size, className)}
    >
      <ShoppingBag className="size-4" />
      {label}
    </button>
  );
}

/** Compact round "+" button used on product cards. */
export function QuickAdd({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => add(product)}
      aria-label={`Add ${product.name} to cart`}
      className={
        className ??
        "grid size-10 place-items-center rounded-full bg-white text-ink shadow-sm ring-1 ring-line transition-all hover:bg-navy hover:text-white hover:ring-navy"
      }
    >
      <Plus className="size-4.5" />
    </button>
  );
}

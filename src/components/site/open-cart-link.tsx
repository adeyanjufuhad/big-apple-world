"use client";

import { useCart } from "@/components/cart/cart-provider";

export function OpenCartLink({ className }: { className?: string }) {
  const { setOpen, count } = useCart();
  return (
    <button type="button" onClick={() => setOpen(true)} className={className}>
      View cart{count > 0 && ` (${count})`}
    </button>
  );
}

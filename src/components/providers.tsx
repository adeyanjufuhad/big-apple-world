"use client";

import type { Catalog } from "@/lib/products";
import { MotionConfig } from "motion/react";
import { CartProvider } from "./cart/cart-provider";
import { CatalogProvider } from "./catalog-provider";

export function Providers({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CatalogProvider catalog={catalog}>
        <CartProvider>{children}</CartProvider>
      </CatalogProvider>
    </MotionConfig>
  );
}

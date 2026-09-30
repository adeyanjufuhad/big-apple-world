"use client";

import { track } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// React runs effects twice in development; don't count the same view twice.
let last = { path: "", at: 0 };

/** Records page views and WhatsApp link clicks. Checkout is recorded by the cart. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const now = Date.now();
    if (last.path === pathname && now - last.at < 2000) return;
    last = { path: pathname, at: now };
    track("page_view", { path: pathname });
    const product = pathname.match(/^\/product\/([^/]+)/);
    if (product) track("product_view", { path: pathname, productSlug: decodeURIComponent(product[1]) });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (link && !link.hasAttribute("data-checkout")) track("whatsapp_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

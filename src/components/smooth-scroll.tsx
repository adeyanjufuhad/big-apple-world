"use client";

import { ReactLenis } from "lenis/react";
import { useMemo, useSyncExternalStore } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

/**
 * Smooth, inertia-based page scrolling (Lenis). Always rendered so the tree never changes
 * shape; for people who prefer reduced motion the smoothing is simply switched off.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const options = useMemo(
    () => ({
      lerp: reduce ? 1 : 0.09,
      smoothWheel: !reduce,
      // Scrollable panels (cart list, quick view) keep their own native scrolling.
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // Same-page links like /#visit glide there, stopping below the sticky header.
      anchors: { offset: -96 },
    }),
    [reduce],
  );

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}

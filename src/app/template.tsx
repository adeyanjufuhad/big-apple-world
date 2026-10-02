"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

// A template re-mounts on every navigation, so this plays a page transition:
// a navy curtain wipes up and the new page rises in. Skipped on first load
// so the initial render isn't hidden behind an animation.
let hasNavigated = false;

const ease = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasNavigated);
  const lenis = useLenis();

  useEffect(() => {
    hasNavigated = true;
    // Next scrolls to the new segment, which leaves the announcement bar and page
    // top hidden under the sticky header. Start new pages at the very top instead,
    // unless the link targets an anchor (e.g. /#visit).
    if (animate && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      lenis?.scrollTo(0, { immediate: true, force: true });
    }
  }, [animate, lenis]);

  return (
    <>
      {animate && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70] grid origin-top place-items-center bg-navy"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.1 }}
        >
          <motion.span
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="grid size-16 place-items-center rounded-full bg-white"
          >
            <Image src="/logo.png" alt="" width={36} height={37} />
          </motion.span>
        </motion.div>
      )}
      <motion.div
        initial={animate ? { opacity: 0, y: 28 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}

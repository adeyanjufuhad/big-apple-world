"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin apple-red bar along the top that fills as you scroll down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[3px] origin-left bg-apple"
    />
  );
}

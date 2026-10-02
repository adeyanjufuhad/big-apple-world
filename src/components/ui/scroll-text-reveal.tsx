"use client";

// Based on "Reading Text Reveal" by waleedkibhen, via 21st.dev:
// https://21st.dev/waleedkibhen/reading-text-reveal
// Adapted: driven by Motion's scroll progress (no per-frame React re-renders),
// takes any text, supports styled phrases, and shows full text for reduced motion.
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export type RevealPart = string | { text: string; className?: string };

function Word({
  word,
  index,
  total,
  progress,
  className,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  className?: string;
}) {
  const start = index / total;
  const opacity = useTransform(progress, [start, Math.min(start + 1.5 / total, 1)], [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={className}>
      {word}{" "}
    </motion.span>
  );
}

/** Words light up one by one as the block scrolls through the viewport. */
export function ScrollTextReveal({
  parts,
  as: Tag = "p",
  className,
}: {
  parts: RevealPart[];
  as?: "p" | "h2" | "h3";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const words = parts.flatMap((part) => {
    const { text, className: partClass } = typeof part === "string" ? { text: part, className: undefined } : part;
    return text.split(/\s+/).filter(Boolean).map((word) => ({ word, className: partClass }));
  });

  return (
    <div ref={ref}>
      <Tag className={className}>
        {reduceMotion
          ? words.map((w, i) => (
              <span key={i} className={w.className}>
                {w.word}{" "}
              </span>
            ))
          : words.map((w, i) => (
              <Word key={i} word={w.word} index={i} total={words.length} progress={scrollYProgress} className={w.className} />
            ))}
      </Tag>
    </div>
  );
}

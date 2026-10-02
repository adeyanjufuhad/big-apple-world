"use client";

// Container Scroll Animation by manuarora700 (Aceternity UI), via 21st.dev:
// https://21st.dev/manuarora700/container-scroll-animation
// Adapted: motion/react instead of framer-motion, brand styling, typed props,
// a media-query hook instead of resize state, and reduced-motion support.
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 768px)";

function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export function ContainerScroll({
  titleComponent,
  children,
  className,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.85, 0.95] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-[52rem] items-center justify-center p-2 md:h-[76rem] md:p-20", className)}
    >
      <div className="relative w-full py-10 md:py-32" style={{ perspective: "1000px" }}>
        <motion.div style={reduceMotion ? undefined : { translateY: translate }} className="mx-auto max-w-5xl text-center">
          {titleComponent}
        </motion.div>
        <Card rotate={rotate} scale={scale} still={!!reduceMotion}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Card({
  rotate,
  scale,
  still,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  still: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        ...(still ? {} : { rotateX: rotate, scale }),
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto -mt-12 h-[34rem] w-full max-w-5xl rounded-[30px] border-4 border-ink/90 bg-ink p-2 md:h-[40rem] md:p-5"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-canvas md:p-4">{children}</div>
    </motion.div>
  );
}

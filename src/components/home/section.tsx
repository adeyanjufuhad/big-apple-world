"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 text-sm text-muted", className)}>
      <span className="h-px w-6 bg-apple" />
      {children}
    </p>
  );
}

export const headingClass = "text-[2.5rem] leading-[1] font-medium tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]";

export function Section({
  id,
  title,
  eyebrow,
  link,
  action,
  align = "left",
  className,
  children,
}: {
  id?: string;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  link?: { href: string; label: string };
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  children: React.ReactNode;
}) {
  const center = align === "center";
  return (
    <section id={id} className={cn("mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24", className)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "mb-10 flex gap-6 lg:mb-12",
            center ? "flex-col items-center text-center" : "items-end justify-between",
          )}
        >
          <div className={cn(center && "flex flex-col items-center")}>
            {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
            <h2 className={headingClass}>{title}</h2>
          </div>
          {(action || (link && !center)) && (
            <div className="flex shrink-0 items-center gap-4">
              {link && !center && (
                <Link href={link.href} className="group hidden items-center gap-1.5 text-sm font-medium sm:inline-flex">
                  {link.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              {action}
            </div>
          )}
        </div>
        {children}
        {link && (
          <div className={cn("mt-10", center ? "flex justify-center" : "sm:hidden")}>
            <Link
              href={link.href}
              className="group inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium ring-1 ring-line transition-colors hover:bg-ink hover:text-white hover:ring-ink"
            >
              {link.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}

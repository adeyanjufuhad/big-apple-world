"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function Section({
  id,
  title,
  eyebrow,
  link,
  className,
  children,
}: {
  id?: string;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  link?: { href: string; label: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8 lg:py-20", className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-8 flex items-end justify-between gap-6 lg:mb-10">
          <div>
            {eyebrow && <div className="mb-2 text-sm text-muted">{eyebrow}</div>}
            <h2 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{title}</h2>
          </div>
          {link && (
            <Link
              href={link.href}
              className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-navy sm:inline-flex"
            >
              {link.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        {children}
        {link && (
          <Link href={link.href} className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-navy sm:hidden">
            {link.label}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </motion.div>
    </section>
  );
}

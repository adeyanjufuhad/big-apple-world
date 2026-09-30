"use client";

import { WhatsAppIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const tiles = [
  { src: "/products/pedicure-chair.jpg", alt: "Luxury pedicure chair", bg: "bg-sand", className: "row-span-2" },
  { src: "/products/facial-steamer.jpg", alt: "NTFS facial steamer", bg: "bg-navy-soft", className: "" },
  { src: "/products/nail-lamp.jpg", alt: "Cordless UV/LED nail lamp", bg: "bg-apple-soft", className: "" },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8 lg:pt-16 lg:pb-20">
      <div>
        <motion.p
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-muted"
        >
          <span className="size-1.5 rounded-full bg-apple" />
          Direct distributor · Balogun Market, Lagos
        </motion.p>

        <motion.h1
          {...fadeUp(0.08)}
          className="mt-6 font-display text-[3.4rem] leading-[0.92] tracking-tight sm:text-7xl lg:text-[5.5rem]"
        >
          Beauty &amp; spa
          <br />
          essentials, <em className="text-navy">at</em>
          <br />
          <em className="text-apple">wholesale</em> prices.
        </motion.h1>

        <motion.p {...fadeUp(0.16)} className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Nails, pedicure &amp; manicure, spa products and salon equipment — sourced straight from the makers and
          priced for salons, spas and resellers.
        </motion.p>

        <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className={buttonClass("primary", "lg", "group")}>
            Shop the collection
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={whatsappLink(`Hello ${site.name}, I'd like to make an enquiry.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("outline", "lg")}
          >
            <WhatsAppIcon className="size-4.5 text-[#25D366]" />
            Chat with us
          </a>
        </motion.div>
      </div>

      <div className="grid aspect-[5/4] grid-cols-[1.25fr_1fr] grid-rows-2 gap-3 sm:gap-4">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.src}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden rounded-3xl ${tile.bg} ${tile.className}`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-contain p-4 mix-blend-multiply sm:p-6"
            />
            {i === 0 && (
              <Link
                href="/shop?category=pedicure-manicure"
                className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 text-sm backdrop-blur transition-colors hover:bg-white"
              >
                <span>
                  <span className="block text-xs text-muted">Salon ready</span>
                  <span className="font-medium">Pedicure &amp; Manicure</span>
                </span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

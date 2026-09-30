"use client";

import { buttonClass } from "@/components/ui/button";
import { getProduct } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, BadgePercent, Factory, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { headingClass } from "./section";

const reasons = [
  {
    icon: Factory,
    title: "Direct from the makers",
    body: "We distribute for leading beauty and cosmetics manufacturers — no middleman in the price.",
  },
  {
    icon: BadgePercent,
    title: "Wholesale pricing",
    body: "Competitive rates for salons, spas, beauty schools and resellers.",
  },
  {
    icon: MessageCircle,
    title: "Order in one chat",
    body: "Build your cart, send it on WhatsApp, and we confirm stock and delivery with you.",
  },
];

const floating = getProduct("ntfs-facial-steamer")!;

export function WhyChooseUs() {
  return (
    <section id="why-us" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end"
      >
        <h2 className={headingClass}>
          Genuine beauty &amp; spa equipment,{" "}
          <em className="font-display font-normal tracking-normal text-navy">sourced direct</em> and priced for your
          business.
        </h2>
        <div className="max-w-sm lg:justify-self-end">
          <p className="text-muted">
            One store in Balogun Market for everything a salon or spa runs on — from nail lamps to pedicure chairs.
          </p>
          <Link href="/#visit" className={buttonClass("ink", "md", "group mt-5")}>
            Know more
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <ul className="grid gap-5 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-[1.5rem] bg-sand p-7"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-white text-navy shadow-sm">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-12 text-lg font-medium">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="relative min-h-[240px] overflow-hidden rounded-[1.5rem]"
          >
            <Image
              src="/products/pedicure-chair.jpg"
              alt="Pedicure chair set up in a salon"
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
              Salon-grade equipment
            </span>
          </motion.li>
        </ul>

        <Link
          href={`/product/${floating.slug}`}
          className="group relative flex min-h-[360px] flex-col items-center justify-center rounded-[1.5rem] bg-white p-6 ring-1 ring-line"
        >
          <motion.div
            className="relative h-64 w-full"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={floating.image}
              alt={floating.name}
              fill
              sizes="(min-width: 1024px) 25vw, 80vw"
              className="object-contain mix-blend-multiply"
            />
          </motion.div>
          <motion.div
            className="mt-2 h-4 w-40 rounded-[50%] bg-ink/15 blur-md"
            animate={{ scaleX: [1, 0.8, 1], opacity: [0.8, 0.5, 0.8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-sand py-2 pr-2 pl-4 text-sm">
            <span>
              {floating.name} · <strong className="font-semibold">{formatPrice(floating.price)}</strong>
            </span>
            <span className="grid size-7 place-items-center rounded-full bg-ink text-white transition-colors group-hover:bg-apple">
              <ArrowRight className="size-3.5" />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}

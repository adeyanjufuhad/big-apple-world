"use client";

import { useCart } from "@/components/cart/cart-provider";
import { WhatsAppIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

const SLIDE_MS = 5000;

const ease = [0.22, 1, 0.36, 1] as const;
const words = "Everything your salon & spa needs, at".split(" ");

function Headline() {
  return (
    <h1 className="text-[2.75rem] leading-[0.98] font-medium tracking-[-0.045em] sm:text-6xl lg:text-[4rem] xl:text-[4.6rem]">
      {words.map((w, i) => (
        <span key={i} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
      <motion.span
        className="relative inline-block font-display font-normal tracking-normal italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 + words.length * 0.06, ease }}
      >
        wholesale
        <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full" aria-hidden="true">
          <motion.path
            d="M3 11 C 45 3, 110 2, 197 8"
            fill="none"
            stroke="#E83136"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 1, ease: "easeInOut" }}
          />
        </svg>
      </motion.span>{" "}
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 + words.length * 0.06, ease }}
      >
        prices.
      </motion.span>
    </h1>
  );
}

function SpinningBadge() {
  const id = useId();
  return (
    <div className="relative grid size-24 place-items-center rounded-full bg-white text-navy shadow-xl shadow-night/20 sm:size-28">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      >
        <defs>
          <path id={id} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text fontSize="8.4" fontWeight="600" fill="currentColor">
          <textPath href={`#${id}`} textLength="228" lengthAdjust="spacing">
            DIRECT DISTRIBUTOR • WHOLESALE PRICES •
          </textPath>
        </text>
      </motion.svg>
      <Image src="/logo.png" alt="" width={30} height={31} />
    </div>
  );
}

export function Hero({ slides }: { slides: Product[] }) {
  const [index, setIndex] = useState(0);
  const { add } = useCart();
  const product = slides[index % Math.max(slides.length, 1)];

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, slides.length]);

  return (
    <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 lg:px-8">
      <div className="relative isolate grid overflow-hidden rounded-[2rem] bg-navy text-white lg:min-h-[640px] lg:grid-cols-[1.15fr_1fr]">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute -top-40 -right-24 -z-10 size-[560px] rounded-full bg-apple/35 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 -z-10 size-[480px] rounded-full bg-[#7b7ce0]/30 blur-[110px]" />
        <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.14] mix-blend-soft-light" />

        {/* Copy */}
        <div className="flex flex-col justify-between gap-14 p-6 pt-7 sm:p-10 lg:p-14">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.slug}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.name}`}
                  className="py-2"
                >
                  <span className="block h-[3px] w-8 overflow-hidden rounded-full bg-white/20 sm:w-10">
                    {i < index && <span className="block h-full w-full bg-white" />}
                    {i === index && (
                      <motion.span
                        key={index}
                        className="block h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs text-white/60 tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <div>

            <Headline />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease }}
              className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
            >
              Nails, pedicure &amp; manicure, spa products and salon equipment — for salons, spas, beauty schools and
              resellers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/shop" className={buttonClass("light", "lg", "group")}>
                Shop collection
                <span className="grid size-6 place-items-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
              <a
                href={whatsappLink(`Hello ${site.name}, I'd like to make an enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("ghost", "lg", "text-white ring-1 ring-white/25 hover:bg-white/10")}
              >
                <WhatsAppIcon className="size-4.5" />
                Chat with us
              </a>
            </motion.div>
          </div>
        </div>

        {/* Product stage */}
        {product && (
        <div className="relative flex items-end justify-center px-6 pt-4 sm:px-10 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="relative w-full max-w-[330px] sm:max-w-[400px] lg:max-w-[440px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-sand">
              <div className="absolute inset-x-10 bottom-20 h-8 rounded-[50%] bg-ink/10 blur-xl" />
              <AnimatePresence initial={false}>
                <motion.div
                  key={product.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 1.04 }}
                  transition={{ duration: 0.8, ease }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 440px, 80vw"
                    className="object-contain px-8 pt-16 pb-28 mix-blend-multiply"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute top-[18%] -left-4 sm:-left-12">
              <SpinningBadge />
            </div>

            <div className="absolute inset-x-3 bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pl-4 text-ink shadow-xl shadow-night/20 backdrop-blur sm:inset-x-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={product.slug}
                  className="min-w-0 flex-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="truncate text-xs text-muted">{product.categoryName}</p>
                  <Link href={`/product/${product.slug}`} className="block truncate text-sm font-medium hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-sm font-semibold tabular-nums">{formatPrice(product.price)}</p>
                </motion.div>
              </AnimatePresence>
              <button
                onClick={() => add(product)}
                aria-label={`Add ${product.name} to cart`}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-white transition-colors hover:bg-apple"
              >
                <Plus className="size-5" />
              </button>
            </div>
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
}

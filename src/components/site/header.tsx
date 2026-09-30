"use client";

import { useCart } from "@/components/cart/cart-provider";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/#categories", label: "Categories" },
  { href: "/#best-sellers", label: "Best sellers" },
  { href: "/#new-arrivals", label: "New in" },
  { href: "/#visit", label: "Visit us" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${site.name} home`}>
      <Image src="/logo.png" alt="" width={34} height={35} priority />
      <span className="leading-none">
        <span className="block text-[17px] font-semibold tracking-tight">
          Big <span className="text-apple">Apple</span>
        </span>
        <span className="block text-[10px] font-medium tracking-[0.32em] text-navy">WORLD</span>
      </span>
    </Link>
  );
}

function SearchForm({ className }: { className?: string }) {
  return (
    <form action="/shop" role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
      <input
        name="q"
        type="search"
        placeholder="Search products…"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-sand/60 pr-4 pl-11 text-sm outline-none transition-colors placeholder:text-muted focus:border-navy focus:bg-white"
      />
    </form>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <button
          className={buttonClass("ghost", "icon", "-ml-2 lg:hidden")}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-ink/75 transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchForm className="hidden w-64 md:block xl:w-72" />
          <button
            onClick={() => setOpen(true)}
            className={buttonClass("ghost", "icon", "relative")}
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 grid min-w-4.5 place-items-center rounded-full bg-apple px-1 text-[10px] leading-4.5 font-semibold text-white tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchForm />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            className="overflow-hidden border-t border-line bg-white lg:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <ul className="px-4 py-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-3.5 text-[15px] last:border-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

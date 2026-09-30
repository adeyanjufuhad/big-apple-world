"use client";

import { useCart } from "@/components/cart/cart-provider";
import { WhatsAppIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { useIsClient } from "@/lib/use-is-client";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

const nav = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/shop", label: "Shop", match: (p: string) => p.startsWith("/shop") || p.startsWith("/product") },
  { href: "/#categories", label: "Categories" },
  { href: "/#best-sellers", label: "Best sellers" },
  { href: "/#visit", label: "Visit us" },
];

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

function useScrolled() {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${site.name} home`}>
      <span className={cn("grid place-items-center", light && "size-11 rounded-full bg-white")}>
        <Image src="/logo.png" alt="" width={light ? 28 : 34} height={light ? 29 : 35} priority />
      </span>
      <span className="leading-none">
        <span className={cn("block text-[17px] font-semibold tracking-tight", light && "text-white")}>
          Big <span className={light ? "text-[#ff6b70]" : "text-apple"}>Apple</span>
        </span>
        <span className={cn("block text-[10px] font-medium tracking-[0.32em]", light ? "text-white/60" : "text-navy")}>
          WORLD
        </span>
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
        className="h-10 w-full rounded-full bg-white pr-4 pl-10 text-sm ring-1 ring-line outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-navy"
      />
    </form>
  );
}

const iconBtn =
  "relative grid size-10 place-items-center rounded-full bg-white ring-1 ring-line transition-colors hover:bg-ink hover:text-white hover:ring-ink";

export function Header() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();
  // The pre-built page shell doesn't know the current path, so mark the active link
  // only after hydration — otherwise server and client HTML differ.
  const isClient = useIsClient();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-canvas/85 backdrop-blur-lg transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_var(--color-line),0_8px_24px_-12px_rgb(22_22_58/0.12)]",
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 md:h-18 lg:px-8">
        <button
          className={buttonClass("ghost", "icon", "-ml-2 lg:hidden")}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Logo />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-white p-1 ring-1 ring-line lg:flex"
          aria-label="Main"
        >
          {nav.map((item) => {
            const active = isClient && (item.match?.(pathname) ?? false);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors",
                  active ? "text-white" : "text-ink/70 hover:bg-sand hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchForm className="hidden w-56 md:block lg:hidden xl:block" />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className={cn(iconBtn, "hidden sm:grid")}
          >
            <WhatsAppIcon className="size-4.5" />
          </a>
          <button onClick={() => setOpen(true)} className={iconBtn} aria-label={`Open cart, ${count} items`}>
            <ShoppingBag className="size-4.5" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-apple px-1 text-[10px] leading-5 font-semibold text-white tabular-nums ring-2 ring-canvas"
              >
                {count}
              </motion.span>
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
            className="overflow-hidden border-t border-line bg-canvas lg:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="px-4 pt-2 pb-6">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-4 text-2xl font-medium tracking-tight"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

import { TikTokIcon } from "@/components/icons";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import Link from "next/link";
import { OpenCartLink } from "./open-cart-link";
import { Logo } from "./header";

const link = "text-[15px] text-white/65 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <div className="pointer-events-none absolute -top-40 left-1/3 size-[480px] rounded-full bg-navy/40 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-12 sm:px-6 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-6 md:col-span-3 lg:col-span-1">
          <Logo light />
          <p className="text-[15px] leading-relaxed text-white/65">
            Copyright © {new Date().getFullYear()} {site.legalName}
            <br />
            All rights reserved
          </p>
          <div className="flex items-center gap-3">
            {site.tiktok ? (
              <a
                href={site.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Big Apple World on TikTok"
                className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-night"
              >
                <TikTokIcon className="size-4.5" />
              </a>
            ) : (
              <span
                title="TikTok — coming soon"
                aria-label="TikTok (coming soon)"
                className="grid size-10 place-items-center rounded-full bg-white/10"
              >
                <TikTokIcon className="size-4.5" />
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Shop</h3>
          <ul className="mt-6 space-y-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className={link}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Information</h3>
          <ul className="mt-6 space-y-4">
            <li>
              <Link href="/#why-us" className={link}>
                About us
              </Link>
            </li>
            <li>
              <Link href="/#visit" className={link}>
                Visit our store
              </Link>
            </li>
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Get directions
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={link}>
                Contact us
              </a>
            </li>
            <li>
              <a href={`tel:+${site.whatsapp}`} className={link}>
                Call {site.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">My Cart</h3>
          <ul className="mt-6 space-y-4">
            <li>
              <OpenCartLink className={link} />
            </li>
            <li>
              <Link href="/shop" className={link}>
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/shop?stock=1" className={link}>
                In stock
              </Link>
            </li>
            <li>
              <Link href="/shop?sort=new" className={link}>
                New arrivals
              </Link>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={link}>
                Order on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/45 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>{site.address.join(", ")}</p>
          <p>{site.hours}</p>
        </div>
      </div>
    </footer>
  );
}

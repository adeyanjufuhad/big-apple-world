import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import Link from "next/link";
import { Logo } from "./header";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{site.description}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Shop</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Visit</h3>
          <address className="space-y-1 text-sm leading-relaxed text-muted not-italic">
            {site.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="pt-2">{site.hours}</p>
          </address>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Contact</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                WhatsApp · {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:+${site.whatsapp}`} className="hover:text-ink">
                Call · {site.phoneDisplay}
              </a>
            </li>
            <li>Ask for {site.contactPerson}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

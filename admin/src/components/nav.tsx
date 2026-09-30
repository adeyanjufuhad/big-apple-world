"use client";

import { cn } from "@/lib/cn";
import { FolderTree, LayoutDashboard, Package, ReceiptText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ReceiptText },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: FolderTree },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SideNav({ pending }: { pending: number }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1" aria-label="Main">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active ? "bg-white/12 font-medium text-white" : "text-white/65 hover:bg-white/6 hover:text-white",
            )}
          >
            <Icon className="size-4.5" />
            {label}
            {href === "/orders" && pending > 0 && (
              <span className="ml-auto rounded-full bg-apple px-2 py-0.5 text-[11px] font-semibold text-white tabular-nums">
                {pending}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function TabBar({ pending }: { pending: number }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn("relative flex flex-col items-center gap-1 py-2.5 text-[11px]", active ? "text-navy" : "text-muted")}
          >
            <Icon className="size-5" />
            {label}
            {href === "/orders" && pending > 0 && (
              <span className="absolute top-1.5 left-1/2 ml-2 rounded-full bg-apple px-1.5 text-[10px] leading-4 font-semibold text-white">
                {pending}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

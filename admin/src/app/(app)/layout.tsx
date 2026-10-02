import { SideNav, TabBar } from "@/components/nav";
import { requireAdmin } from "@/lib/auth/server";
import { getPendingCount } from "@/lib/stats";
import { ExternalLink, LogOut } from "lucide-react";
import Image from "next/image";
import { signOut } from "../(auth)/actions";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const pending = await getPendingCount();
  const storefront = process.env.STOREFRONT_URL ?? "/";

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col bg-night p-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-full bg-white">
            <Image src="/logo.png" alt="" width={24} height={25} />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold">Big Apple Beauty</span>
            <span className="block text-xs text-white/50">Admin</span>
          </span>
        </div>
        <div className="mt-10 flex-1">
          <SideNav pending={pending} />
        </div>
        <a
          href={storefront}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/6 hover:text-white"
        >
          <ExternalLink className="size-4" /> View shop
        </a>
        <div className="flex items-center gap-3 rounded-2xl bg-white/6 p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{user.name}</span>
            <span className="block truncate text-xs text-white/50">{user.email}</span>
          </span>
          <form action={signOut}>
            <button aria-label="Sign out" title="Sign out" className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-line">
              <Image src="/logo.png" alt="" width={22} height={23} />
            </span>
            <span className="font-semibold">Big Apple Beauty</span>
          </div>
          <form action={signOut}>
            <button aria-label="Sign out" className="grid size-9 place-items-center rounded-full ring-1 ring-line">
              <LogOut className="size-4" />
            </button>
          </form>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>

      <TabBar pending={pending} />
    </div>
  );
}

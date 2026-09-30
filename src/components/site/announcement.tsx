import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Announcement() {
  return (
    <div className="bg-navy text-white">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs tracking-wide sm:text-[13px]">
        Wholesale prices on beauty &amp; spa essentials
        <span className="mx-2 text-white/40">·</span>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          Order on WhatsApp {site.phoneDisplay}
        </a>
      </p>
    </div>
  );
}

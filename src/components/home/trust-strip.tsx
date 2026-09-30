import { site } from "@/lib/site";
import { BadgePercent, Factory, MessageCircle, Store } from "lucide-react";

const items = [
  { icon: Factory, title: "Direct distributor", body: "Straight from the manufacturers" },
  { icon: BadgePercent, title: "Wholesale prices", body: "For salons, spas & resellers" },
  { icon: MessageCircle, title: "Order on WhatsApp", body: "Send your whole cart in one tap" },
  { icon: Store, title: "Visit the store", body: site.hours },
];

export function TrustStrip() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-line ring-1 ring-line lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex flex-col items-start gap-3 bg-white p-4 sm:flex-row sm:items-center sm:gap-3.5 sm:p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-soft text-navy">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block text-xs leading-snug text-muted">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

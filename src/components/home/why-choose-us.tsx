import { BadgePercent, Factory, LayoutGrid, MessageCircle } from "lucide-react";

const reasons = [
  {
    icon: Factory,
    title: "Direct from the makers",
    body: "We distribute for leading beauty and cosmetics manufacturers, so there’s no middleman in the price.",
  },
  {
    icon: BadgePercent,
    title: "Wholesale pricing",
    body: "Competitive rates for salons, spas, beauty schools and resellers — buy one or stock up.",
  },
  {
    icon: LayoutGrid,
    title: "Everything in one place",
    body: "Nails, pedicure & manicure, spa products and salon equipment under one roof.",
  },
  {
    icon: MessageCircle,
    title: "Order in one chat",
    body: "Build your cart, send it on WhatsApp, and our team confirms stock and delivery with you.",
  },
];

export function WhyChooseUs() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {reasons.map(({ icon: Icon, title, body }) => (
        <li key={title} className="bg-white p-7 lg:p-8">
          <span className="grid size-11 place-items-center rounded-full bg-navy-soft text-navy">
            <Icon className="size-5" />
          </span>
          <h3 className="mt-6 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        </li>
      ))}
    </ul>
  );
}

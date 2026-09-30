import { WhatsAppIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Clock, MapPin, User } from "lucide-react";

export function Visit() {
  return (
    <section id="visit" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
        <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light" />
        <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-apple/30 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 -z-10 size-96 rounded-full bg-navy/70 blur-[100px]" />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2.5 text-sm text-white/60">
              <span className="h-px w-6 bg-apple" />
              Visit our store
            </p>
            <h2 className="mt-3 text-4xl leading-[1] font-medium tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              See it, touch it,{" "}
              <em className="font-display font-normal tracking-normal">take it home.</em>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("whatsapp", "lg")}
              >
                <WhatsAppIcon className="size-5" />
                {site.phoneDisplay}
              </a>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("outline", "lg", "border-white/25 bg-transparent text-white hover:border-white")}
              >
                Get directions
              </a>
            </div>
          </div>
          <dl className="grid gap-6 text-sm sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div>
              <dt className="flex items-center gap-2 text-white/60">
                <MapPin className="size-4" /> Address
              </dt>
              <dd className="mt-2 leading-relaxed">
                {site.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-white/60">
                <Clock className="size-4" /> Opening hours
              </dt>
              <dd className="mt-2">{site.hours}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-white/60">
                <User className="size-4" /> Ask for
              </dt>
              <dd className="mt-2">{site.contactPerson}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

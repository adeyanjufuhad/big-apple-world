import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(`Hello ${site.name}, I have a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}

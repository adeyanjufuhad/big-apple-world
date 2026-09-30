"use client";

import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function WhatsAppFloat() {
  const [bubble, setBubble] = useState(true);
  const href = whatsappLink(`Hello ${site.name}, I have a question.`);

  return (
    <div className="fixed right-5 bottom-5 z-30 flex items-center gap-3">
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ delay: 1.2 }}
            className="relative hidden items-center rounded-2xl bg-white py-3 pr-9 pl-4 text-sm shadow-lg shadow-black/10 ring-1 ring-line sm:flex"
          >
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted">
              Need help? <strong className="font-semibold text-ink">Click here to WhatsApp us</strong>
            </a>
            <button
              onClick={() => setBubble(false)}
              aria-label="Dismiss"
              className="absolute top-1/2 right-2.5 grid size-5 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-sand hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.5s]" />
        <WhatsAppIcon className="relative size-7" />
      </a>
    </div>
  );
}

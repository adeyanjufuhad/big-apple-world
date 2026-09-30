import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { Announcement } from "@/components/site/announcement";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Beauty & Spa Wholesale in Lagos`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrument.variable}`}>
      <body>
        <CartProvider>
          <Announcement />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}

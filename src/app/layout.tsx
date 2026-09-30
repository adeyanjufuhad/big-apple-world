import { AnalyticsTracker } from "@/components/analytics-tracker";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Providers } from "@/components/providers";
import { Announcement } from "@/components/site/announcement";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { getCatalog } from "@/lib/catalog";
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const catalog = await getCatalog();
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${instrument.variable}`}>
      <body>
        <Providers catalog={catalog}>
          <Announcement />
          <Header />
          <main className="overflow-x-clip">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
          <AnalyticsTracker />
        </Providers>
      </body>
    </html>
  );
}

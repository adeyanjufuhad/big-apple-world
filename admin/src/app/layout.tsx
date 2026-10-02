import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: { default: "Big Apple Beauty Admin", template: "%s · Big Apple Beauty Admin" },
  description: "Manage products, categories and orders for Big Apple Beauty.",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Big Apple Beauty Admin", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#3d3e91" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}

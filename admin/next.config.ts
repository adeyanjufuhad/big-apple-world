import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Next.js inlines small bootstrap scripts, so script-src needs 'unsafe-inline' unless every
// response carries a nonce. The admin never embeds third-party scripts.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.aws.neon.tech",
  "font-src 'self'",
  `connect-src 'self'${isProd ? "" : " ws: wss:"}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The admin is its own app inside the storefront repo; build from this folder only.
  turbopack: { root: __dirname },
  experimental: {
    // Product photos are uploaded through server actions (5 MB max per image).
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.aws.neon.tech", pathname: "/product-images/**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

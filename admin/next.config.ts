import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Product photos are uploaded through server actions (5 MB max per image).
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.aws.neon.tech", pathname: "/product-images/**" }],
  },
};

export default nextConfig;

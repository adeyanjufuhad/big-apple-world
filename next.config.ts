import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos uploaded from the admin live in Neon Object Storage.
    remotePatterns: [{ protocol: "https", hostname: "**.aws.neon.tech", pathname: "/product-images/**" }],
  },
};

export default withBotId(nextConfig);

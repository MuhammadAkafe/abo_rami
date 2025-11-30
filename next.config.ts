import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - nodeMiddleware is available in Next.js 15.2+ but types may not be updated
    nodeMiddleware: true,
  },
};

export default nextConfig;

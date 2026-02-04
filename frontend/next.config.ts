import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
    // Enable remote patterns for external image sources
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig

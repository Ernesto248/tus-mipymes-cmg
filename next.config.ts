import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.2.0.2", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default nextConfig

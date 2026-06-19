import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.2.0.2", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tus-mipymes.nyc3.cdn.digitaloceanspaces.com",
      },
    ],
  },
}

export default nextConfig

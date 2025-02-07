import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false, // Ensure TypeScript errors are treated as build errors
  },
};

export default nextConfig;

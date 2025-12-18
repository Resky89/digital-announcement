import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Enable image optimization from external sources
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/api/**",
      },
      {
        protocol: "http",
        hostname: "host.docker.internal",
        port: "8000",
        pathname: "/api/**",
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

export default nextConfig;


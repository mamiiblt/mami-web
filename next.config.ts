import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.mamii.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: "https://mamii.dev",
    API_BASE: process.env.NODE_ENV === "development" ? "https://api.instafel.mamii.dev" : "https://api.instafel.mamii.dev"
  },
  htmlLimitedBots: /.*/,
  reactStrictMode: false
};

export default nextConfig;

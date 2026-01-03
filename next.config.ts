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
        hostname: "i.scdn.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: "https://mamii.dev",
    API_BASE: process.env.NODE_ENV === "development" ? "https://studious-orbit-4697x6x4wv636jp-3001.app.github.dev" : "https://api.instafel.app"
  },
  htmlLimitedBots: /.*/,
  reactStrictMode: false
};

export default nextConfig;

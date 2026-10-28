import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.27", "192.168.1.5", "localhost"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: false },
      { source: "/services", destination: "/", permanent: false },
      { source: "/services/:path*", destination: "/", permanent: false },
      { source: "/payment", destination: "/", permanent: false },
      { source: "/contact", destination: "/", permanent: false },
      { source: "/disclosure", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@telugu-yuvatha/shared"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }]
  }
};

export default nextConfig;

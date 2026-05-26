import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix workspace root detection when multiple package-lock.json files exist.
  // Without this, Turbopack picks the wrong root and fetchServerResponse fails
  // during client-side navigation.
  outputFileTracingRoot: path.join(__dirname, "../"),

  // Disable the default "failed to fetch" retry overlay noise in dev
  devIndicators: false,
};

export default nextConfig;

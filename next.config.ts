import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal self-contained server build for Docker deployment.
  output: "standalone",
  experimental: {
    // Allow image uploads via Server Actions up to 5 MB (default is 1 MB).
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

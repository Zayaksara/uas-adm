import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal self-contained server build for Docker deployment.
  output: "standalone",
  experimental: {
    // Allow image uploads via Server Actions up to 5 MB (default is 1 MB).
    serverActions: {
      bodySizeLimit: "5mb",
      // Izinkan origin produksi (di belakang reverse proxy) agar Server
      // Actions (mis. login) tidak ditolak karena beda host/port.
      allowedOrigins: ["54.254.231.65:8080", "54.254.231.65", "localhost:8080"],
    },
  },
};

export default nextConfig;

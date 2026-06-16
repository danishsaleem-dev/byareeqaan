import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve modern formats; the optimizer down-sizes per device.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage (project subdomain).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // Smaller client bundles → lower TBT. Pull only what's used from big barrels.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  poweredByHeader: false,
};

export default nextConfig;

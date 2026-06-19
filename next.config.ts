import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve modern formats; the optimizer down-sizes per device.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year — images are content-addressed via URL
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage (project subdomain).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // Smaller client bundles → lower TBT. Pull only what's used from big barrels.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  poweredByHeader: false,
};

export default nextConfig;

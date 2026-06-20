import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are already resized + re-encoded to WebP client-side before upload
  // (see src/lib/image-compress.ts), so Vercel's Image Optimization pipeline
  // would just be re-processing already-optimal files at extra cost. Disabling
  // it means next/image renders a plain <img> with no /_next/image proxy call
  // and zero "Image Optimization - Transformations" usage on Vercel.
  images: {
    unoptimized: true,
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

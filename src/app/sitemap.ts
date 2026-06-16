import type { MetadataRoute } from "next";
import { listPublishedProducts, listCollections } from "@/lib/data";
import { absUrl } from "@/lib/seo";

// Refresh the sitemap hourly so new products/collections appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absUrl("/collections"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absUrl("/story"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/why-us"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absUrl("/shipping"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absUrl("/returns"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  let products: MetadataRoute.Sitemap = [];
  let collections: MetadataRoute.Sitemap = [];

  try {
    const [prods, cols] = await Promise.all([
      listPublishedProducts(),
      listCollections(),
    ]);
    products = prods.map((p) => ({
      url: absUrl(`/shop/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    collections = cols.map((c) => ({
      url: absUrl(`/collections/${c.slug}`),
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // If the DB is unreachable at build/revalidate time, still ship static routes.
  }

  return [...staticRoutes, ...collections, ...products];
}

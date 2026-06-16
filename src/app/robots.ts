import type { MetadataRoute } from "next";
import { SITE_URL, absUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}

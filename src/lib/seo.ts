import { site } from "./site";
import type { Product, Collection } from "./types";

/**
 * Canonical origin for the site. Override per-environment with
 * NEXT_PUBLIC_SITE_URL (e.g. the production domain). No trailing slash.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://byareeqaan.com"
).replace(/\/+$/, "");

/** Absolute URL for a path (`/shop` → `https://…/shop`). */
export function absUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const PRICE_CURRENCY = "PKR";

// ── JSON-LD builders ──────────────────────────────────────────

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: SITE_URL,
    logo: absUrl("/logo.png"),
    description: site.description,
    sameAs: [
      site.socials.instagram.url,
      site.socials.tiktok.url,
      site.socials.facebook.url,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${site.whatsapp.number}`,
      contactType: "customer service",
      areaServed: "Worldwide",
      availableLanguage: ["en", "ur"],
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: SITE_URL,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function productLd(product: Product) {
  const primary =
    product.images.find((i) => i.primary)?.url ?? product.images[0]?.url;
  const inStock = !product.variants?.length
    ? true
    : product.variants.some((v) => v.available);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seoDesc || product.shortDesc || site.description,
    sku: product.sku || undefined,
    image: primary ? [primary] : undefined,
    material: product.material || undefined,
    brand: { "@type": "Brand", name: site.name },
    url: absUrl(`/shop/${product.slug}`),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: PRICE_CURRENCY,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absUrl(`/shop/${product.slug}`),
      seller: { "@type": "Organization", name: site.name },
    },
  };
}

export function collectionLd(collection: Collection, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description || site.description,
    url: absUrl(`/collections/${collection.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/shop/${p.slug}`),
        name: p.name,
      })),
    },
  };
}

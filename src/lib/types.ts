// Shared admin/CMS types (camelCase app-side; mapped from snake_case DB rows).

export type ProductStatus = "published" | "draft" | "archived";

export interface ProductImage {
  url: string;
  primary?: boolean;
}

export interface Variant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory: number;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  material: string;
  sku: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  comparePrice: number | null;
  cost: number | null;
  stock: number | null;
  weight: number | null;
  slug: string;
  status: ProductStatus;
  featured: boolean;
  sold: boolean;
  seoTitle: string;
  seoDesc: string;
  images: ProductImage[];
  videos: string[];
  variants: Variant[];
  collectionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type ProductPayload = Omit<ProductInput, "slug"> & {
  id?: string;
  slug?: string;
};

export type CollectionPayload = {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
};

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type CollectionInput = Omit<
  Collection,
  "id" | "createdAt" | "updatedAt"
>;

// ── Customer accounts ─────────────────────────────────────────
export interface Profile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export type AddressInput = Omit<Address, "id" | "createdAt">;

// ── Orders ────────────────────────────────────────────────────
export type OrderStatus =
  | "pending_payment"
  | "payment_review"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "faisal_bank" | "nayapay" | "easypaisa";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  price: number;
  variantId?: string;
  variantTitle?: string;
  qty: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  paymentScreenshotUrl: string | null;
  status: OrderStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  userId?: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  paymentScreenshotUrl?: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  altText: string;
  url: string;
  path: string;
  type: "image" | "video";
  size: number;
  createdAt: string;
}

// ── Homepage configuration ────────────────────────────────────
export interface HomepageConfig {
  announcement: { enabled: boolean; text: string };
  hero: {
    images: string[];
    headline: string;
    subheadline: string;
    tagline: string;
    ctaText: string;
    ctaLink: string;
  };
  features: { items: { label: string; text: string }[] };
  story: { image: string; title: string; content: string };
  contact: { title: string; message: string };
}

// ── Site settings ─────────────────────────────────────────────
export interface SiteConfig {
  brand: { siteName: string; tagline: string; logoUrl: string; faviconUrl: string };
  socials: { instagram: string; tiktok: string; facebook: string; whatsapp: string };
  contact: { email: string; phone: string };
  policies: { shipping: string; returns: string };
}

export const DEFAULT_HOMEPAGE: HomepageConfig = {
  announcement: { enabled: true, text: "Free delivery all over Pakistan over 5000PKR · We also ship worldwide ✨" },
  hero: {
    images: [],
    headline: "Tiny details. Big statements.",
    subheadline: "",
    tagline: "Trendy · Minimal · Affordable Luxe",
    ctaText: "Shop the edit",
    ctaLink: "/shop",
  },
  features: {
    items: [
      { label: "Shipping", text: "All over Pakistan & worldwide" },
      { label: "Handpicked", text: "Trend-led, minimal pieces" },
      { label: "Ordering", text: "Quick & easy on WhatsApp" },
    ],
  },
  story: {
    image: "",
    title: "Small brand, big intentions.",
    content:
      "By Areeqaan began as a love letter to minimal, modern adornment — jewellery that feels personal, never loud.",
  },
  contact: {
    title: "Let's find your next favourite",
    message: "Message us on WhatsApp or slide into the DMs — we'll help you pick, style and ship anywhere.",
  },
};

export const DEFAULT_SITE: SiteConfig = {
  brand: {
    siteName: "By Areeqaan",
    tagline: "Trendy · Minimal · Affordable Luxe",
    logoUrl: "/logo.png",
    faviconUrl: "",
  },
  socials: {
    instagram: "@byareeqaan",
    tiktok: "@by_areeqan",
    facebook: "ByAreeqan",
    whatsapp: "923364246604",
  },
  contact: { email: "", phone: "" },
  policies: { shipping: "", returns: "" },
};

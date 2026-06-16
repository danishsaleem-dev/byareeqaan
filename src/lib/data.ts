import "server-only";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { slugify } from "./slug";
import {
  type Product,
  type ProductInput,
  type ProductStatus,
  type Collection,
  type CollectionInput,
  type MediaFile,
  type HomepageConfig,
  type SiteConfig,
  DEFAULT_HOMEPAGE,
  DEFAULT_SITE,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── mappers ───────────────────────────────────────────────────
function toProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    material: r.material ?? "",
    sku: r.sku ?? "",
    shortDesc: r.short_desc ?? "",
    fullDesc: r.full_desc ?? "",
    price: Number(r.price ?? 0),
    comparePrice: r.compare_price == null ? null : Number(r.compare_price),
    weight: r.weight == null ? null : Number(r.weight),
    slug: r.slug,
    status: r.status,
    featured: !!r.featured,
    seoTitle: r.seo_title ?? "",
    seoDesc: r.seo_desc ?? "",
    images: r.images ?? [],
    videos: r.videos ?? [],
    variants: r.variants ?? [],
    collectionIds: r.collection_ids ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function fromProductInput(p: ProductInput) {
  return {
    name: p.name,
    material: p.material,
    sku: p.sku,
    short_desc: p.shortDesc,
    full_desc: p.fullDesc,
    price: p.price,
    compare_price: p.comparePrice,
    weight: p.weight,
    slug: p.slug,
    status: p.status,
    featured: p.featured,
    seo_title: p.seoTitle,
    seo_desc: p.seoDesc,
    images: p.images,
    videos: p.videos,
    variants: p.variants,
    collection_ids: p.collectionIds,
    updated_at: new Date().toISOString(),
  };
}

function toCollection(r: any): Collection {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    imageUrl: r.image_url ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toMedia(r: any): MediaFile {
  return {
    id: r.id,
    filename: r.filename,
    url: r.url,
    path: r.path ?? "",
    type: r.type,
    size: Number(r.size ?? 0),
    createdAt: r.created_at,
  };
}

// ── products ──────────────────────────────────────────────────
export async function listProducts(): Promise<Product[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data) : null;
}

// ── public (storefront) reads — published only, resilient if unconfigured ──
export async function listPublishedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data) : null;
}

export async function uniqueProductSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  const sb = supabaseAdmin();
  const root = slugify(base) || "product";
  let slug = root;
  let n = 1;
  // Loop until we find a free slug (bounded in practice).
  for (;;) {
    const { data } = await sb
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || data.id === excludeId) return slug;
    slug = `${root}-${++n}`;
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .insert(fromProductInput(input))
    .select("*")
    .single();
  if (error) throw error;
  return toProduct(data);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("products")
    .update(fromProductInput(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return toProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function setProductStatus(
  id: string,
  status: ProductStatus,
): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("products")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function setProductFeatured(
  id: string,
  featured: boolean,
): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("products")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ── collections ───────────────────────────────────────────────
export async function listCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toCollection);
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toCollection(data) : null;
}

export async function getCollection(id: string): Promise<Collection | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toCollection(data) : null;
}

export async function uniqueCollectionSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  const sb = supabaseAdmin();
  const root = slugify(base) || "collection";
  let slug = root;
  let n = 1;
  for (;;) {
    const { data } = await sb
      .from("collections")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || data.id === excludeId) return slug;
    slug = `${root}-${++n}`;
  }
}

export async function createCollection(
  input: CollectionInput,
): Promise<Collection> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("collections")
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description,
      image_url: input.imageUrl,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return toCollection(data);
}

export async function updateCollection(
  id: string,
  input: CollectionInput,
): Promise<Collection> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("collections")
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description,
      image_url: input.imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return toCollection(data);
}

export async function deleteCollection(id: string): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("collections").delete().eq("id", id);
  if (error) throw error;
}

// ── media ─────────────────────────────────────────────────────
export async function listMedia(): Promise<MediaFile[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toMedia);
}

export async function createMedia(
  m: Omit<MediaFile, "id" | "createdAt">,
): Promise<MediaFile> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("media")
    .insert({
      filename: m.filename,
      url: m.url,
      path: m.path,
      type: m.type,
      size: m.size,
    })
    .select("*")
    .single();
  if (error) throw error;
  return toMedia(data);
}

export async function getMedia(id: string): Promise<MediaFile | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("media")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toMedia(data) : null;
}

export async function deleteMedia(id: string): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("media").delete().eq("id", id);
  if (error) throw error;
}

// ── stats ─────────────────────────────────────────────────────
export async function getStats() {
  const sb = supabaseAdmin();
  const [products, published, collections] = await Promise.all([
    sb.from("products").select("id", { count: "exact", head: true }),
    sb
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    sb.from("collections").select("id", { count: "exact", head: true }),
  ]);
  return {
    totalProducts: products.count ?? 0,
    publishedProducts: published.count ?? 0,
    totalCollections: collections.count ?? 0,
  };
}

// ── settings (homepage + site) ────────────────────────────────
async function getSetting(key: string): Promise<any | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
}

async function setSetting(key: string, value: any): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

export async function getHomepage(): Promise<HomepageConfig> {
  if (!isSupabaseConfigured()) return DEFAULT_HOMEPAGE;
  const s = (await getSetting("homepage")) ?? {};
  return {
    announcement: { ...DEFAULT_HOMEPAGE.announcement, ...s.announcement },
    hero: { ...DEFAULT_HOMEPAGE.hero, ...s.hero },
    features: s.features ?? DEFAULT_HOMEPAGE.features,
    story: { ...DEFAULT_HOMEPAGE.story, ...s.story },
    contact: { ...DEFAULT_HOMEPAGE.contact, ...s.contact },
  };
}

export async function saveHomepage(config: HomepageConfig): Promise<void> {
  await setSetting("homepage", config);
}

export async function getSite(): Promise<SiteConfig> {
  if (!isSupabaseConfigured()) return DEFAULT_SITE;
  const s = (await getSetting("site")) ?? {};
  return {
    brand: { ...DEFAULT_SITE.brand, ...s.brand },
    socials: { ...DEFAULT_SITE.socials, ...s.socials },
    contact: { ...DEFAULT_SITE.contact, ...s.contact },
    policies: { ...DEFAULT_SITE.policies, ...s.policies },
  };
}

export async function saveSite(config: SiteConfig): Promise<void> {
  await setSetting("site", config);
}

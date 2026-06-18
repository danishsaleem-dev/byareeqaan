"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductStatus,
  setProductFeatured,
  setProductSold,
  uniqueProductSlug,
  createCollection,
  updateCollection,
  deleteCollection,
  uniqueCollectionSlug,
  createMedia,
  deleteMedia,
  getMedia,
  listMedia,
  getHomepage,
  saveHomepage,
  getSite,
  saveSite,
} from "@/lib/data";
import {
  uploadToStorage,
  deleteFromStorage,
  createSignedUpload,
} from "@/lib/storage";
import {
  type ProductInput,
  type ProductStatus,
  type ProductPayload,
  type CollectionPayload,
  type Collection,
  type MediaFile,
  type HomepageConfig,
  type SiteConfig,
} from "@/lib/types";
import { slugify } from "@/lib/slug";

async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function revalidateAdmin() {
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
}

// ── auth ──────────────────────────────────────────────────────
export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Incorrect password. Try again." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ── products ──────────────────────────────────────────────────
export async function saveProductAction(
  payload: ProductPayload,
): Promise<{ ok: boolean; id?: string; slug?: string; error?: string }> {
  await requireAuth();
  try {
    const slug = await uniqueProductSlug(
      payload.slug || payload.name,
      payload.id,
    );
    const input: ProductInput = {
      name: payload.name.trim() || "Untitled product",
      material: payload.material ?? "",
      sku: payload.sku ?? "",
      shortDesc: payload.shortDesc ?? "",
      fullDesc: payload.fullDesc ?? "",
      price: Number(payload.price) || 0,
      comparePrice:
        payload.comparePrice == null ? null : Number(payload.comparePrice),
      cost: payload.cost == null ? null : Number(payload.cost),
      stock: payload.stock == null ? null : Number(payload.stock),
      weight: payload.weight == null ? null : Number(payload.weight),
      slug,
      status: payload.status,
      featured: !!payload.featured,
      sold: !!payload.sold,
      seoTitle: payload.seoTitle ?? "",
      seoDesc: payload.seoDesc ?? "",
      images: payload.images ?? [],
      videos: payload.videos ?? [],
      variants: payload.variants ?? [],
      collectionIds: payload.collectionIds ?? [],
    };
    const saved = payload.id
      ? await updateProduct(payload.id, input)
      : await createProduct(input);
    revalidateAdmin();
    return { ok: true, id: saved.id, slug: saved.slug };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteProductAction(id: string) {
  await requireAuth();
  await deleteProduct(id);
  revalidateAdmin();
}

export async function setProductStatusAction(id: string, status: ProductStatus) {
  await requireAuth();
  await setProductStatus(id, status);
  revalidateAdmin();
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
  await requireAuth();
  await setProductFeatured(id, featured);
  revalidateAdmin();
}

export async function toggleSoldAction(id: string, sold: boolean) {
  await requireAuth();
  await setProductSold(id, sold);
  revalidateAdmin();
}

// ── collections ───────────────────────────────────────────────
export async function saveCollectionAction(
  payload: CollectionPayload,
): Promise<{ ok: boolean; collection?: Collection; error?: string }> {
  await requireAuth();
  try {
    const slug = await uniqueCollectionSlug(
      payload.slug || payload.name,
      payload.id,
    );
    const input = {
      name: payload.name.trim() || "Untitled collection",
      slug,
      description: payload.description ?? "",
      imageUrl: payload.imageUrl ?? "",
    };
    const saved = payload.id
      ? await updateCollection(payload.id, input)
      : await createCollection(input);
    revalidateAdmin();
    return { ok: true, collection: saved };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCollectionAction(id: string) {
  await requireAuth();
  await deleteCollection(id);
  revalidateAdmin();
}

// ── media ─────────────────────────────────────────────────────
export async function uploadMediaAction(formData: FormData) {
  await requireAuth();
  try {
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    const saved = [];
    for (const file of files) {
      if (file.size === 0) continue;
      const up = await uploadToStorage(file);
      const record = await createMedia({
        filename: up.filename,
        url: up.url,
        path: up.path,
        type: up.type,
        size: up.size,
      });
      saved.push(record);
    }
    revalidateAdmin();
    return { ok: true, files: saved };
  } catch (e) {
    return { ok: false, error: (e as Error).message, files: [] };
  }
}

export async function deleteMediaAction(id: string) {
  await requireAuth();
  const media = await getMedia(id);
  if (media) {
    await deleteFromStorage(media.path);
    await deleteMedia(id);
  }
  revalidateAdmin();
}

/** List all library media (admin-gated). */
export async function listMediaAction(): Promise<MediaFile[]> {
  await requireAuth();
  return listMedia();
}

/**
 * Step 1 of a direct upload: mint a signed upload URL. The browser then PUTs the
 * file straight to Storage, so large videos never hit the Server Action body cap.
 */
export async function createUploadUrlAction(
  filename: string,
  contentType: string,
): Promise<
  | { ok: true; path: string; token: string; publicUrl: string }
  | { ok: false; error: string }
> {
  await requireAuth();
  try {
    const { path, token, publicUrl } = await createSignedUpload(
      filename,
      contentType,
    );
    return { ok: true, path, token, publicUrl };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Step 2 of a direct upload: record the uploaded file in the media library. */
export async function recordMediaAction(meta: {
  filename: string;
  url: string;
  path: string;
  type: "image" | "video";
  size: number;
}): Promise<{ ok: boolean; file?: MediaFile; error?: string }> {
  await requireAuth();
  try {
    const file = await createMedia(meta);
    revalidateAdmin();
    return { ok: true, file };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ── homepage & site settings ──────────────────────────────────
export async function saveHomepageSectionAction<
  K extends keyof HomepageConfig,
>(section: K, value: HomepageConfig[K]) {
  await requireAuth();
  try {
    const current = await getHomepage();
    await saveHomepage({ ...current, [section]: value });
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveSiteGroupAction<K extends keyof SiteConfig>(
  group: K,
  value: SiteConfig[K],
) {
  await requireAuth();
  try {
    const current = await getSite();
    await saveSite({ ...current, [group]: value });
    revalidateAdmin();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Used by the inline "create collection" control inside the product form. */
export async function quickCreateCollectionAction(name: string) {
  await requireAuth();
  const slug = await uniqueCollectionSlug(name);
  const collection = await createCollection({
    name: name.trim() || "Untitled",
    slug: slug || slugify(name),
    description: "",
    imageUrl: "",
  });
  revalidateAdmin();
  return collection;
}

import "server-only";
import { supabaseAdmin, MEDIA_BUCKET } from "./supabase";

export interface UploadedFile {
  url: string;
  path: string;
  filename: string;
  size: number;
  type: "image" | "video";
}

/** Upload a File to Supabase Storage and return its public URL + metadata. */
export async function uploadToStorage(file: File): Promise<UploadedFile> {
  const sb = supabaseAdmin();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await sb.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw error;

  const { data } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return {
    url: data.publicUrl,
    path,
    filename: file.name,
    size: file.size,
    type: file.type.startsWith("video") ? "video" : "image",
  };
}

export interface SignedUpload {
  path: string;
  token: string;
  publicUrl: string;
}

/**
 * Mint a signed upload URL so the browser can push file bytes straight to
 * Storage (no Server Action body-size limit). Returns the storage path, the
 * one-time upload token, and the eventual public URL.
 */
export async function createSignedUpload(
  filename: string,
  _contentType?: string,
): Promise<SignedUpload> {
  const sb = supabaseAdmin();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_") || "file";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

  const { data, error } = await sb.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path);
  if (error) throw error;

  const { data: pub } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: pub.publicUrl };
}

export async function deleteFromStorage(path: string): Promise<void> {
  if (!path) return;
  const sb = supabaseAdmin();
  await sb.storage.from(MEDIA_BUCKET).remove([path]);
}

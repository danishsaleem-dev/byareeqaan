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

export async function deleteFromStorage(path: string): Promise<void> {
  if (!path) return;
  const sb = supabaseAdmin();
  await sb.storage.from(MEDIA_BUCKET).remove([path]);
}

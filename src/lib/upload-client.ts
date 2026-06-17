import { createUploadUrlAction, recordMediaAction } from "@/app/admin/actions";
import { supabaseBrowser, MEDIA_BUCKET } from "./supabase-browser";
import type { MediaFile } from "./types";

/**
 * Upload a single file straight to Supabase Storage from the browser using a
 * signed URL minted server-side, then record it in the media library. Keeps
 * large images/videos off the Server Action request body (which is size-capped).
 */
export async function uploadFileDirect(file: File): Promise<MediaFile> {
  const contentType = file.type || "application/octet-stream";

  const signed = await createUploadUrlAction(file.name, contentType);
  if (!signed.ok) throw new Error(signed.error);

  const sb = supabaseBrowser();
  const { error } = await sb.storage
    .from(MEDIA_BUCKET)
    .uploadToSignedUrl(signed.path, signed.token, file, { contentType });
  if (error) throw new Error(error.message);

  const rec = await recordMediaAction({
    filename: file.name,
    url: signed.publicUrl,
    path: signed.path,
    type: contentType.startsWith("video") ? "video" : "image",
    size: file.size,
  });
  if (!rec.ok || !rec.file) throw new Error(rec.error || "Could not save media");
  return rec.file;
}

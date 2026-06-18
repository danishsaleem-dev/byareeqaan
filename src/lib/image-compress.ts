/**
 * Client-side image compression. Resizes oversized images and re-encodes them
 * as WebP before upload, so Supabase Storage holds small files instead of the
 * multi-MB originals phones produce. Runs entirely in the browser — no server
 * cost. Videos, GIFs and SVGs are passed through untouched.
 */

const MAX_DIMENSION = 1600; // longest edge, px — plenty for web display
const QUALITY = 0.82; // WebP quality (0–1)
const SKIP_TYPES = ["image/gif", "image/svg+xml"];

export interface CompressOptions {
  maxDimension?: number;
  quality?: number;
}

export async function compressImage(
  file: File,
  opts: CompressOptions = {},
): Promise<File> {
  // Only touch raster images; leave videos/gifs/svgs alone.
  if (!file.type.startsWith("image/") || SKIP_TYPES.includes(file.type)) {
    return file;
  }

  const maxDim = opts.maxDimension ?? MAX_DIMENSION;
  const quality = opts.quality ?? QUALITY;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Decoder failed (rare) — upload the original rather than lose the file.
    return file;
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  if (!blob) return file;

  // If compression somehow made it bigger (already-tiny images), keep original.
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

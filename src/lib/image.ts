/**
 * Whether a src can go through the Next.js image optimizer. Local paths and our
 * known image hosts (Supabase Storage, Unsplash) are optimizable; anything else
 * (e.g. an arbitrary URL pasted in the admin) falls back to a plain <img> so the
 * page never crashes on an un-allowed host.
 */
export function isOptimizable(src?: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true; // local public asset
  try {
    const host = new URL(src).hostname;
    return host === "images.unsplash.com" || host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

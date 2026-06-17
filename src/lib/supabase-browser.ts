import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Storage bucket name, safe to reference from client code. */
export const MEDIA_BUCKET = "media";

let client: SupabaseClient | null = null;

/**
 * Browser Supabase client (anon key). Used only to push file bytes straight to
 * Storage via a signed upload URL minted server-side — this keeps large
 * images/videos off the Server Action request body (which is size-capped).
 */
export function supabaseBrowser(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase browser client is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }
  if (!client) {
    client = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

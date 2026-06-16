import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Whether the Supabase env vars are present. Used to show a setup screen. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && serviceKey);
}

let client: SupabaseClient | null = null;

/**
 * Server-only admin client (service-role key, bypasses RLS).
 * Never import this into a client component.
 */
export function supabaseAdmin(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    );
  }
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const MEDIA_BUCKET = "media";

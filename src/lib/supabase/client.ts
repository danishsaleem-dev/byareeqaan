import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for client components (stores the session in cookies so the
 * server can read it). Used for magic-link sign-in and reading auth state.
 */
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

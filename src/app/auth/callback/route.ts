import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Magic-link landing. Supabase redirects here with a one-time `code`; we
 * exchange it for a session (sets the auth cookies) and send the user on to
 * wherever they were headed.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  // Only allow same-site relative redirects.
  const next =
    nextParam && nextParam.startsWith("/") ? nextParam : "/account";

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Surface Supabase's own error (e.g. expired link) on the login screen.
  const reason =
    searchParams.get("error_description") || searchParams.get("error") || "link";
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent(reason)}&next=${encodeURIComponent(next)}`,
  );
}

import "server-only";
import { createSupabaseServer } from "./supabase/server";

export async function getWishlistIds(): Promise<string[]> {
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb.from("wishlists").select("product_id").eq("user_id", user.id);
  return (data ?? []).map((r) => r.product_id);
}

export async function addToWishlist(productId: string): Promise<void> {
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");
  await sb.from("wishlists").upsert({ user_id: user.id, product_id: productId }, { onConflict: "user_id,product_id" });
}

export async function removeFromWishlist(productId: string): Promise<void> {
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");
  await sb.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
}

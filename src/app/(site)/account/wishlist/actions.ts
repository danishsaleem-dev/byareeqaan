"use server";

import { revalidatePath } from "next/cache";
import { addToWishlist, removeFromWishlist, getWishlistIds } from "@/lib/wishlist";

export async function toggleWishlistAction(productId: string, isWishlisted: boolean) {
  if (isWishlisted) {
    await removeFromWishlist(productId);
  } else {
    await addToWishlist(productId);
  }
  revalidatePath("/account/wishlist");
}

export async function checkWishlistAction(productId: string): Promise<boolean> {
  const ids = await getWishlistIds();
  return ids.includes(productId);
}

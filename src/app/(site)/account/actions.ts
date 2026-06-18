"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  upsertProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/account";
import type { AddressInput } from "@/lib/types";

export async function signOutAction() {
  const sb = await createSupabaseServer();
  await sb.auth.signOut();
  redirect("/");
}

export async function saveProfileAction(input: {
  fullName: string;
  phone: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    await upsertProfile(input);
    revalidatePath("/account", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveAddressAction(
  id: string | null,
  input: AddressInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (id) await updateAddress(id, input);
    else await createAddress(input);
    revalidatePath("/account/addresses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteAddressAction(id: string) {
  await deleteAddress(id);
  revalidatePath("/account/addresses");
}

export async function setDefaultAddressAction(id: string) {
  await setDefaultAddress(id);
  revalidatePath("/account/addresses");
}

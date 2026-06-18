import "server-only";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServer } from "./supabase/server";
import type { Profile, Address, AddressInput } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toAddress(r: any): Address {
  return {
    id: r.id,
    fullName: r.full_name ?? "",
    phone: r.phone ?? "",
    address: r.address ?? "",
    city: r.city ?? "",
    country: r.country ?? "Pakistan",
    isDefault: !!r.is_default,
    createdAt: r.created_at,
  };
}

/** The signed-in user, or null. */
export async function getUser(): Promise<User | null> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

/** Profile for the signed-in user (merged with their auth email), or null. */
export async function getProfile(): Promise<Profile | null> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data } = await sb
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: data?.full_name ?? (user.user_metadata?.full_name as string) ?? "",
    phone: data?.phone ?? "",
  };
}

export async function upsertProfile(input: {
  fullName: string;
  phone: string;
}): Promise<void> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await sb.from("profiles").upsert(
    {
      id: user.id,
      full_name: input.fullName,
      phone: input.phone,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function listAddresses(): Promise<Address[]> {
  const sb = await createSupabaseServer();
  const { data, error } = await sb
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toAddress);
}

export async function createAddress(input: AddressInput): Promise<void> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");

  if (input.isDefault) await clearDefault(user.id);

  const { error } = await sb.from("addresses").insert({
    user_id: user.id,
    full_name: input.fullName,
    phone: input.phone,
    address: input.address,
    city: input.city,
    country: input.country || "Pakistan",
    is_default: input.isDefault,
  });
  if (error) throw error;
}

export async function updateAddress(
  id: string,
  input: AddressInput,
): Promise<void> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");

  if (input.isDefault) await clearDefault(user.id);

  const { error } = await sb
    .from("addresses")
    .update({
      full_name: input.fullName,
      phone: input.phone,
      address: input.address,
      city: input.city,
      country: input.country || "Pakistan",
      is_default: input.isDefault,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAddress(id: string): Promise<void> {
  const sb = await createSupabaseServer();
  const { error } = await sb.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

export async function setDefaultAddress(id: string): Promise<void> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not signed in");
  await clearDefault(user.id);
  const { error } = await sb
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id);
  if (error) throw error;
}

async function clearDefault(userId: string): Promise<void> {
  const sb = await createSupabaseServer();
  await sb
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true);
}

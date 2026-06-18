"use server";

import { createOrder } from "@/lib/orders";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { CreateOrderInput, OrderItem, PaymentMethod } from "@/lib/types";

export interface PlaceOrderInput {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  paymentScreenshotUrl?: string;
}

export async function placeOrderAction(
  input: PlaceOrderInput,
): Promise<{ id: string; orderNumber: string }> {
  if (!input.items.length) throw new Error("Bag is empty");

  // Attach to logged-in user if any
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const order = await createOrder({
    ...input,
    userId: user?.id,
  } satisfies CreateOrderInput);

  return { id: order.id, orderNumber: order.orderNumber };
}

/** Mint a signed upload URL for a payment screenshot. */
export async function createScreenshotUploadAction(
  filename: string,
): Promise<{ path: string; token: string }> {
  const ext = filename.split(".").pop() ?? "jpg";
  const path = `screenshots/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const sb = supabaseAdmin();
  const { data, error } = await sb.storage
    .from("media")
    .createSignedUploadUrl(path);
  if (error) throw error;
  return { path, token: data.token };
}

/** Convert a storage path to a public URL. */
export async function getScreenshotUrlAction(path: string): Promise<string> {
  const sb = supabaseAdmin();
  const { data } = sb.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

/** Attach a payment screenshot URL to an existing order. */
export async function addOrderScreenshotAction(
  orderId: string,
  screenshotUrl: string,
): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("orders")
    .update({ payment_screenshot_url: screenshotUrl, status: "payment_review" })
    .eq("id", orderId);
  if (error) throw error;
}

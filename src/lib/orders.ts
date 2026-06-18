import "server-only";
import { supabaseAdmin } from "./supabase";
import { createSupabaseServer } from "./supabase/server";
import type {
  Order,
  CreateOrderInput,
  OrderItem,
  PaymentMethod,
  OrderStatus,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toOrder(r: any): Order {
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id,
    email: r.email,
    fullName: r.full_name,
    phone: r.phone,
    address: r.address,
    city: r.city,
    country: r.country,
    items: (r.items as OrderItem[]) ?? [],
    subtotal: Number(r.subtotal),
    paymentMethod: r.payment_method as PaymentMethod,
    paymentScreenshotUrl: r.payment_screenshot_url ?? null,
    status: r.status as OrderStatus,
    adminNotes: r.admin_notes ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Create a new order (service-role, bypasses RLS — works for guests too). */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("orders")
    .insert({
      user_id: input.userId ?? null,
      email: input.email,
      full_name: input.fullName,
      phone: input.phone,
      address: input.address,
      city: input.city,
      country: input.country || "Pakistan",
      items: input.items,
      subtotal: input.subtotal,
      payment_method: input.paymentMethod,
      payment_screenshot_url: input.paymentScreenshotUrl ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return toOrder(data);
}

/** Fetch a single order by ID (service-role). */
export async function getOrder(id: string): Promise<Order | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toOrder(data) : null;
}

/** All orders for a user, newest first. */
export async function listUserOrders(userId: string): Promise<Order[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toOrder);
}

/** Get the currently signed-in user's orders via the user-scoped client. */
export async function listMyOrders(): Promise<Order[]> {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];
  return listUserOrders(user.id);
}

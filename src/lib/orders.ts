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

/** All orders across all customers (admin). */
export async function listAllOrders(status?: OrderStatus): Promise<Order[]> {
  const sb = supabaseAdmin();
  let q = sb.from("orders").select("*").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toOrder);
}

/** Update order status + optional admin note (admin). */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string,
): Promise<void> {
  const sb = supabaseAdmin();
  const patch: Record<string, unknown> = { status };
  if (adminNotes !== undefined) patch.admin_notes = adminNotes;
  const { error } = await sb.from("orders").update(patch).eq("id", id);
  if (error) throw error;
}

/** Order counts grouped by status (for dashboard). */
export async function getOrderStats(): Promise<{
  total: number;
  pendingPayment: number;
  paymentReview: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  revenue: number;
  profit: number;
}> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("orders").select("status,subtotal");
  if (error) throw error;
  const rows = data ?? [];

  const count = (s: string) => rows.filter((r) => r.status === s).length;
  const sum = (statuses: string[]) =>
    rows
      .filter((r) => statuses.includes(r.status))
      .reduce((n, r) => n + Number(r.subtotal), 0);

  // Revenue = confirmed + packed + shipped + delivered
  const revenueStatuses = ["confirmed", "packed", "shipped", "delivered"];

  // Profit requires product cost — we approximate from orders data only
  // (full profit calc needs a join to products; this gives gross revenue for now)
  return {
    total: rows.length,
    pendingPayment: count("pending_payment"),
    paymentReview: count("payment_review"),
    confirmed: count("confirmed"),
    shipped: count("shipped"),
    delivered: count("delivered"),
    revenue: sum(revenueStatuses),
    profit: 0, // populated separately when product costs are joined
  };
}

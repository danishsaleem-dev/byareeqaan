import "server-only";
import { supabaseAdmin } from "./supabase";
import type { Order, OrderItem, Product, Collection } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RevenuePoint {
  label: string; // "Jan", "Feb" / "W12" etc.
  revenue: number;
  profit: number;
  orderCount: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  qtySold: number;
  revenue: number;
  profit: number;
  currentStock: number | null;
}

export interface CustomerStat {
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

export interface StockRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  stock: number | null;
  price: number;
  cost: number | null;
  portfolioValue: number | null;
  collectionIds: string[];
}

export interface CollectionPortfolio {
  id: string;
  name: string;
  productCount: number;
  totalStockValue: number;
}

export interface BusinessStats {
  revenue: { total: number; thisMonth: number; thisWeek: number };
  profit: { total: number; thisMonth: number; thisWeek: number };
  orderCounts: {
    total: number;
    pendingPayment: number;
    paymentReview: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenueByMonth: RevenuePoint[]; // last 12 calendar months
  revenueByWeek: RevenuePoint[]; // last 8 weeks
  topProducts: TopProduct[];
  customers: CustomerStat[];
  stock: StockRow[];
  portfolioByCollection: CollectionPortfolio[];
  totalStockValue: number;
  totalCostSpend: number;
  lowStockCount: number;
}

const ACTIVE_STATUSES = ["confirmed", "packed", "shipped", "delivered"];

function weekLabel(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // start of week (Sun)
  return d.toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-PK", {
    month: "short",
    year: "2-digit",
  });
}

function weekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function isoWeekKey(date: Date): string {
  const ws = weekStart(date);
  return ws.toISOString().slice(0, 10);
}

export async function getBusinessStats(): Promise<BusinessStats> {
  const sb = supabaseAdmin();

  const [ordersRes, productsRes, collectionsRes] = await Promise.all([
    sb.from("orders").select("*").order("created_at", { ascending: true }),
    sb.from("products").select("*"),
    sb.from("collections").select("id,name"),
  ]);

  if (ordersRes.error) throw ordersRes.error;
  if (productsRes.error) throw productsRes.error;

  const orders: any[] = ordersRes.data ?? [];
  const products: any[] = productsRes.data ?? [];
  const collections: any[] = collectionsRes.data ?? [];

  // Build a product cost lookup
  const costByProductId = new Map<string, number | null>();
  for (const p of products) {
    costByProductId.set(p.id, p.cost == null ? null : Number(p.cost));
  }
  const stockByProductId = new Map<string, number | null>();
  for (const p of products) {
    stockByProductId.set(p.id, p.stock == null ? null : Number(p.stock));
  }

  // ── Active orders only for revenue/profit ─────────────────────
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  function calcProfit(items: OrderItem[]): number {
    return items.reduce((sum, it) => {
      const cost = costByProductId.get(it.productId);
      if (cost == null) return sum;
      return sum + (it.price - cost) * it.qty;
    }, 0);
  }

  const now = new Date();
  const thisMonthKey = monthKey(now);
  const thisWeekIso = isoWeekKey(now);

  let totalRevenue = 0;
  let thisMonthRevenue = 0;
  let thisWeekRevenue = 0;
  let totalProfit = 0;
  let thisMonthProfit = 0;
  let thisWeekProfit = 0;

  for (const o of activeOrders) {
    const rev = Number(o.subtotal);
    const date = new Date(o.created_at);
    const profit = calcProfit((o.items as OrderItem[]) ?? []);

    totalRevenue += rev;
    totalProfit += profit;

    if (monthKey(date) === thisMonthKey) {
      thisMonthRevenue += rev;
      thisMonthProfit += profit;
    }
    if (isoWeekKey(date) === thisWeekIso) {
      thisWeekRevenue += rev;
      thisWeekProfit += profit;
    }
  }

  // ── Revenue by month (last 12) ─────────────────────────────────
  const monthKeys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(monthKey(d));
  }
  const monthMap = new Map<
    string,
    { revenue: number; profit: number; orderCount: number }
  >();
  for (const k of monthKeys) monthMap.set(k, { revenue: 0, profit: 0, orderCount: 0 });

  for (const o of activeOrders) {
    const k = monthKey(new Date(o.created_at));
    if (monthMap.has(k)) {
      const m = monthMap.get(k)!;
      m.revenue += Number(o.subtotal);
      m.profit += calcProfit((o.items as OrderItem[]) ?? []);
      m.orderCount++;
    }
  }

  const revenueByMonth: RevenuePoint[] = monthKeys.map((k) => ({
    label: monthLabel(k),
    ...monthMap.get(k)!,
  }));

  // ── Revenue by week (last 8) ───────────────────────────────────
  const weekKeys: string[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    weekKeys.push(isoWeekKey(d));
  }
  const weekMap = new Map<
    string,
    { label: string; revenue: number; profit: number; orderCount: number }
  >();
  for (const k of weekKeys) {
    const d = new Date(k);
    weekMap.set(k, { label: weekLabel(d), revenue: 0, profit: 0, orderCount: 0 });
  }
  for (const o of activeOrders) {
    const k = isoWeekKey(new Date(o.created_at));
    if (weekMap.has(k)) {
      const w = weekMap.get(k)!;
      w.revenue += Number(o.subtotal);
      w.profit += calcProfit((o.items as OrderItem[]) ?? []);
      w.orderCount++;
    }
  }
  const revenueByWeek: RevenuePoint[] = weekKeys.map((k) => weekMap.get(k)!);

  // ── Top products ───────────────────────────────────────────────
  const productAgg = new Map<
    string,
    { name: string; qtySold: number; revenue: number; profit: number }
  >();
  for (const o of activeOrders) {
    for (const it of (o.items as OrderItem[]) ?? []) {
      const existing = productAgg.get(it.productId) ?? {
        name: it.name,
        qtySold: 0,
        revenue: 0,
        profit: 0,
      };
      const cost = costByProductId.get(it.productId);
      existing.qtySold += it.qty;
      existing.revenue += it.price * it.qty;
      existing.profit += cost != null ? (it.price - cost) * it.qty : 0;
      productAgg.set(it.productId, existing);
    }
  }
  const topProducts: TopProduct[] = Array.from(productAgg.entries())
    .map(([productId, agg]) => ({
      productId,
      ...agg,
      currentStock: stockByProductId.get(productId) ?? null,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // ── Customer stats ─────────────────────────────────────────────
  const customerMap = new Map<
    string,
    { orderCount: number; totalSpent: number; lastOrderAt: string }
  >();
  for (const o of orders) {
    const email = o.email as string;
    const existing = customerMap.get(email) ?? {
      orderCount: 0,
      totalSpent: 0,
      lastOrderAt: o.created_at,
    };
    existing.orderCount++;
    if (ACTIVE_STATUSES.includes(o.status)) existing.totalSpent += Number(o.subtotal);
    if (o.created_at > existing.lastOrderAt) existing.lastOrderAt = o.created_at;
    customerMap.set(email, existing);
  }
  const customers: CustomerStat[] = Array.from(customerMap.entries())
    .map(([email, s]) => ({ email, ...s }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 20);

  // ── Stock ──────────────────────────────────────────────────────
  const stock: StockRow[] = products.map((p: any) => {
    const s = p.stock == null ? null : Number(p.stock);
    const c = p.cost == null ? null : Number(p.cost);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      status: p.status,
      stock: s,
      price: Number(p.price),
      cost: c,
      portfolioValue: s != null && c != null ? s * c : null,
      collectionIds: p.collection_ids ?? [],
    };
  });

  const totalStockValue = stock.reduce(
    (n, p) => n + (p.portfolioValue ?? 0),
    0,
  );
  const lowStockCount = stock.filter(
    (p) => p.stock != null && p.stock <= 3 && p.status === "published",
  ).length;

  // ── Portfolio by collection ────────────────────────────────────
  const collMap = new Map<string, { name: string; value: number; count: number }>();
  for (const c of collections) {
    collMap.set(c.id, { name: c.name, value: 0, count: 0 });
  }
  for (const p of stock) {
    for (const cid of p.collectionIds) {
      const entry = collMap.get(cid);
      if (entry) {
        entry.value += p.portfolioValue ?? 0;
        entry.count++;
      }
    }
  }
  const portfolioByCollection: CollectionPortfolio[] = Array.from(
    collMap.entries(),
  )
    .map(([id, { name, value, count }]) => ({
      id,
      name,
      totalStockValue: value,
      productCount: count,
    }))
    .sort((a, b) => b.totalStockValue - a.totalStockValue);

  // ── Total cost spend (products sold in active orders) ─────────
  let totalCostSpend = 0;
  for (const o of activeOrders) {
    for (const it of (o.items as OrderItem[]) ?? []) {
      const cost = costByProductId.get(it.productId);
      if (cost != null) totalCostSpend += cost * it.qty;
    }
  }

  // ── Order counts ──────────────────────────────────────────────
  const count = (s: string) => orders.filter((o) => o.status === s).length;
  const orderCounts = {
    total: orders.length,
    pendingPayment: count("pending_payment"),
    paymentReview: count("payment_review"),
    confirmed: count("confirmed"),
    shipped: count("shipped"),
    delivered: count("delivered"),
    cancelled: count("cancelled"),
  };

  return {
    revenue: {
      total: totalRevenue,
      thisMonth: thisMonthRevenue,
      thisWeek: thisWeekRevenue,
    },
    profit: {
      total: totalProfit,
      thisMonth: thisMonthProfit,
      thisWeek: thisWeekProfit,
    },
    orderCounts,
    revenueByMonth,
    revenueByWeek,
    topProducts,
    customers,
    stock,
    portfolioByCollection,
    totalStockValue,
    totalCostSpend,
    lowStockCount,
  };
}

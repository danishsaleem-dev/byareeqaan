import Link from "next/link";
import {
  Plus, LayoutTemplate, ImageIcon, Package, FolderOpen,
  CheckCircle2, ArrowRight, ShoppingCart, TrendingUp, Clock, Truck,
} from "lucide-react";
import { getStats, listProducts } from "@/lib/data";
import { listAllOrders, getOrderStats } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { Card, StatusBadge } from "@/components/admin/ui";
import type { Order, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const ORDER_STATUS_META: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending_payment: { label: "Pending payment", bg: "bg-amber-100", text: "text-amber-700" },
  payment_review:  { label: "Payment review",  bg: "bg-blue-100",  text: "text-blue-700" },
  confirmed:       { label: "Confirmed",        bg: "bg-violet/10", text: "text-violet-deep" },
  packed:          { label: "Packed",           bg: "bg-violet/10", text: "text-violet-deep" },
  shipped:         { label: "Shipped",          bg: "bg-teal-100",  text: "text-teal-700" },
  delivered:       { label: "Delivered",        bg: "bg-emerald-100", text: "text-emerald-700" },
  cancelled:       { label: "Cancelled",        bg: "bg-rose-100",  text: "text-rose-600" },
};

export default async function DashboardPage() {
  const [stats, products, orderStats, recentOrders] = await Promise.all([
    getStats(),
    listProducts(),
    getOrderStats(),
    listAllOrders(),
  ]);

  const recentProducts = products.slice(0, 4);
  const latestOrders = recentOrders.slice(0, 5);
  const needsAttention = orderStats.pendingPayment + orderStats.paymentReview;

  const statCards = [
    {
      label: "Total orders",
      value: orderStats.total,
      icon: ShoppingCart,
      href: "/admin/orders",
      accent: "text-violet-deep",
      bg: "bg-violet/10",
    },
    {
      label: "Revenue",
      value: formatPrice(orderStats.revenue),
      icon: TrendingUp,
      href: "/admin/orders",
      accent: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Needs attention",
      value: needsAttention,
      icon: Clock,
      href: "/admin/orders?status=payment_review",
      accent: needsAttention > 0 ? "text-amber-600" : "text-muted",
      bg: needsAttention > 0 ? "bg-amber-100" : "bg-black/[0.04]",
    },
    {
      label: "Shipped",
      value: orderStats.shipped,
      icon: Truck,
      href: "/admin/orders?status=shipped",
      accent: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      label: "Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
      accent: "text-violet-deep",
      bg: "bg-violet/10",
    },
    {
      label: "Published",
      value: stats.publishedProducts,
      icon: CheckCircle2,
      href: "/admin/products",
      accent: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Collections",
      value: stats.totalCollections,
      icon: FolderOpen,
      href: "/admin/collections",
      accent: "text-violet-deep",
      bg: "bg-violet/10",
    },
  ];

  const actions = [
    { label: "New product",     href: "/admin/products/new",  icon: Plus },
    { label: "Homepage editor", href: "/admin/homepage",      icon: LayoutTemplate },
    { label: "Media library",   href: "/admin/media",         icon: ImageIcon },
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back — here&apos;s your store at a glance.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-deep px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet"
        >
          <Plus size={16} /> New product
        </Link>
      </header>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href}>
              <Card className="flex items-center gap-4 transition-colors hover:border-violet/30">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.accent}`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-2xl font-semibold text-ink">
                    {c.value}
                  </div>
                  <div className="truncate text-xs text-muted">{c.label}</div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-violet-deep hover:underline"
            >
              View all
            </Link>
          </div>
          <Card className="p-0">
            {latestOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">
                No orders yet.
              </div>
            ) : (
              <ul className="divide-y divide-black/[0.06]">
                {latestOrders.map((order) => (
                  <DashOrderRow key={order.id} order={order} />
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* Recent products + quick actions */}
        <div className="space-y-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">
                Quick actions
              </h2>
            </div>
            <div className="space-y-2">
              {actions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.href} href={a.href}>
                    <Card className="group flex items-center justify-between transition-colors hover:border-violet/30">
                      <span className="flex items-center gap-3 text-sm font-medium text-plum">
                        <Icon size={18} className="text-violet-deep" /> {a.label}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-muted transition-transform group-hover:translate-x-0.5"
                      />
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">
                Recent products
              </h2>
              <Link
                href="/admin/products"
                className="text-sm font-medium text-violet-deep hover:underline"
              >
                View all
              </Link>
            </div>
            <Card className="p-0">
              {recentProducts.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-violet-deep underline">
                    Create one
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-black/[0.06]">
                  {recentProducts.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02]"
                      >
                        <Thumb url={p.images.find((i) => i.primary)?.url ?? p.images[0]?.url} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">
                            {p.name}
                          </span>
                          <span className="text-xs text-muted">
                            {formatPrice(p.price)}
                          </span>
                        </span>
                        <StatusBadge status={p.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function DashOrderRow({ order }: { order: Order }) {
  const s = ORDER_STATUS_META[order.status];
  return (
    <li>
      <Link
        href={`/admin/orders/${order.id}`}
        className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02]"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
          <p className="truncate text-xs text-muted">{order.fullName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}>
            {s.label}
          </span>
          <span className="text-sm font-semibold text-ink">
            {formatPrice(order.subtotal)}
          </span>
        </div>
      </Link>
    </li>
  );
}

function Thumb({ url }: { url?: string }) {
  if (!url) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet-deep">
        <Package size={16} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />;
}

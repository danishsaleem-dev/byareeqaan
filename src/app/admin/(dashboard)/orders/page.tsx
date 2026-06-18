import Link from "next/link";
import { listAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { Card } from "@/components/admin/ui";
import { ArrowRight, ShoppingCart } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_META: Record<
  OrderStatus,
  { label: string; bg: string; text: string }
> = {
  pending_payment: { label: "Pending payment", bg: "bg-amber-100", text: "text-amber-700" },
  payment_review:  { label: "Payment review",  bg: "bg-blue-100",  text: "text-blue-700" },
  confirmed:       { label: "Confirmed",        bg: "bg-violet/10", text: "text-violet-deep" },
  packed:          { label: "Packed",           bg: "bg-violet/10", text: "text-violet-deep" },
  shipped:         { label: "Shipped",          bg: "bg-teal-100",  text: "text-teal-700" },
  delivered:       { label: "Delivered",        bg: "bg-emerald-100", text: "text-emerald-700" },
  cancelled:       { label: "Cancelled",        bg: "bg-rose-100",  text: "text-rose-600" },
};

const FILTER_TABS: { label: string; status?: OrderStatus }[] = [
  { label: "All" },
  { label: "Pending payment", status: "pending_payment" },
  { label: "Payment review",  status: "payment_review" },
  { label: "Confirmed",       status: "confirmed" },
  { label: "Shipped",         status: "shipped" },
  { label: "Delivered",       status: "delivered" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const statusFilter = sp.status as OrderStatus | undefined;
  const orders = await listAllOrders(statusFilter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
          {statusFilter ? ` · filtered by ${STATUS_META[statusFilter]?.label}` : ""}
        </p>
      </header>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((t) => {
          const active = (t.status ?? "") === (statusFilter ?? "");
          const href = t.status
            ? `/admin/orders?status=${t.status}`
            : "/admin/orders";
          return (
            <Link
              key={t.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-violet-deep text-white"
                  : "bg-black/[0.04] text-plum/70 hover:bg-black/[0.08]"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Orders list */}
      <Card className="p-0">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <ShoppingCart size={32} className="mb-3 text-muted/40" />
            <p className="text-sm font-medium text-ink">No orders yet</p>
            <p className="mt-1 text-xs text-muted">
              Orders placed on your store will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const s = STATUS_META[order.status];
  const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
  return (
    <li>
      <Link
        href={`/admin/orders/${order.id}`}
        className="group flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-black/[0.02] sm:flex-nowrap"
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{order.orderNumber}</p>
          <p className="text-xs text-muted">
            {order.fullName} · {order.email}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-ink">
            {formatPrice(order.subtotal)}
          </p>
          <p className="text-xs text-muted">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${s.bg} ${s.text}`}
          >
            {s.label}
          </span>
          {order.paymentScreenshotUrl && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
              Screenshot
            </span>
          )}
          <ArrowRight
            size={15}
            className="text-muted transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </Link>
    </li>
  );
}

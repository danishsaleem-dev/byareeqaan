import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { listMyOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Pending payment", color: "bg-amber-100 text-amber-700" },
  payment_review:  { label: "Payment review",  color: "bg-blue-100 text-blue-700" },
  confirmed:       { label: "Confirmed",        color: "bg-violet/10 text-violet-deep" },
  packed:          { label: "Packed",           color: "bg-violet/10 text-violet-deep" },
  shipped:         { label: "Shipped",          color: "bg-teal-100 text-teal-700" },
  delivered:       { label: "Delivered",        color: "bg-emerald-100 text-emerald-700" },
  cancelled:       { label: "Cancelled",        color: "bg-rose-100 text-rose-600" },
};

export default async function OrdersPage() {
  const orders = await listMyOrders();

  return (
    <div>
      <h2 className="mb-5 font-display text-2xl font-medium text-ink">Orders</h2>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum/15 bg-cream/30 py-12 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-violet/10 text-violet-deep">
            <Package size={24} />
          </span>
          <p className="text-sm font-medium text-ink">No orders yet</p>
          <p className="mt-1 text-sm text-muted">
            When you place an order it will appear here.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-violet-deep px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-violet"
          >
            Browse the shop <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const s = STATUS_LABELS[order.status] ?? {
    label: order.status,
    color: "bg-cream text-muted",
  };
  const itemCount = order.items.reduce((n, i) => n + i.qty, 0);

  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="group flex items-center justify-between gap-4 rounded-2xl border border-plum/10 bg-white p-4 transition-all hover:border-violet/30 hover:shadow-soft"
      >
        <div className="min-w-0">
          <p className="font-semibold text-ink">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-muted">
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
            {formatPrice(order.subtotal)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${s.color}`}>
            {s.label}
          </span>
          <ArrowRight
            size={15}
            className="text-muted transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </Link>
    </li>
  );
}

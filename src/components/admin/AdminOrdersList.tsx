"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { deleteOrderAction } from "@/app/admin/actions";
import type { Order, OrderStatus } from "@/lib/types";

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

export function AdminOrdersList({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState(initial);
  const [, start] = useTransition();
  const router = useRouter();

  function handleDelete(order: Order) {
    const ACTIVE = ["confirmed", "packed", "shipped", "delivered"];
    const stockNote = ACTIVE.includes(order.status)
      ? " Stock will be restored for tracked products."
      : "";
    if (!confirm(`Delete order ${order.orderNumber}? This cannot be undone.${stockNote}`)) return;
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    start(async () => {
      await deleteOrderAction(order.id);
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-sm font-medium text-ink">No orders</p>
        <p className="mt-1 text-xs text-muted">Orders placed on your store will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-black/[0.06]">
      {orders.map((order) => {
        const s = STATUS_META[order.status];
        const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
        return (
          <li key={order.id} className="group flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3.5 transition-colors hover:bg-black/[0.02] sm:flex-nowrap">
            <Link
              href={`/admin/orders/${order.id}`}
              className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 sm:flex-nowrap"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{order.orderNumber}</p>
                <p className="text-xs text-muted">{order.fullName} · {order.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{formatPrice(order.subtotal)}</p>
                <p className="text-xs text-muted">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${s.bg} ${s.text}`}>
                  {s.label}
                </span>
                {order.paymentScreenshotUrl && (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
                    Screenshot
                  </span>
                )}
                <ArrowRight size={15} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
            <button
              onClick={() => handleDelete(order)}
              className="ml-1 rounded-lg p-1.5 text-black/20 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
              title="Delete order"
            >
              <Trash2 size={15} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

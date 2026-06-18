import Link from "next/link";
import { listAllOrders } from "@/lib/orders";
import { Card } from "@/components/admin/ui";
import { ShoppingCart } from "lucide-react";
import { AdminOrdersList } from "@/components/admin/AdminOrdersList";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";


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
          <AdminOrdersList initial={orders} />
        )}
      </Card>
    </div>
  );
}


import Link from "next/link";
import { User, MapPin, Package, Heart, ArrowRight } from "lucide-react";
import { getProfile, listAddresses } from "@/lib/account";
import { listMyOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Pending payment", color: "bg-amber-100 text-amber-700" },
  payment_review: { label: "Payment review", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmed", color: "bg-violet/10 text-violet-deep" },
  packed: { label: "Packed", color: "bg-violet/10 text-violet-deep" },
  shipped: { label: "Shipped", color: "bg-teal-100 text-teal-700" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelled", color: "bg-rose-100 text-rose-600" },
};

export default async function AccountOverviewPage() {
  const [profile, addresses, orders] = await Promise.all([
    getProfile(),
    listAddresses(),
    listMyOrders(),
  ]);
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-5">
      {/* details + address summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card href="/account/profile" icon={<User size={18} />} title="My details">
          <p className="text-sm text-ink">{profile?.fullName || "Add your name"}</p>
          <p className="text-sm text-muted">{profile?.email}</p>
          {profile?.phone && (
            <p className="text-sm text-muted">{profile.phone}</p>
          )}
        </Card>

        <Card href="/account/addresses" icon={<MapPin size={18} />} title="Default address">
          {defaultAddr ? (
            <div className="text-sm text-muted">
              <p className="text-ink">{defaultAddr.fullName}</p>
              <p>{defaultAddr.address}</p>
              <p>
                {defaultAddr.city}
                {defaultAddr.country ? `, ${defaultAddr.country}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">No address saved yet.</p>
          )}
        </Card>
      </div>

      {/* Orders */}
      <section className="rounded-2xl border border-plum/10 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet-deep">
              <Package size={18} />
            </span>
            Orders
          </span>
          {orders.length > 3 && (
            <span className="text-xs font-medium text-violet">
              {orders.length} total
            </span>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted">No orders yet.</p>
            <Link
              href="/shop"
              className="mt-2 inline-block text-sm font-medium text-violet underline"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        )}
      </section>

      <Card href="/account/wishlist" icon={<Heart size={18} />} title="Wishlist">
        <p className="text-sm text-muted">Pieces you&apos;ve saved for later.</p>
      </Card>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const s = STATUS_LABELS[order.status] ?? {
    label: order.status,
    color: "bg-cream text-muted",
  };
  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="group flex items-center justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-cream/60"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
          <p className="text-xs text-muted">
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · {formatPrice(order.subtotal)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${s.color}`}
          >
            {s.label}
          </span>
          <ArrowRight
            size={14}
            className="text-muted transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </Link>
    </li>
  );
}

function Card({
  href,
  icon,
  title,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-plum/10 bg-white p-5 transition-all hover:border-violet/30 hover:shadow-soft"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet-deep">
            {icon}
          </span>
          {title}
        </span>
        <ArrowRight
          size={16}
          className="text-muted transition-transform group-hover:translate-x-0.5"
        />
      </div>
      {children}
    </Link>
  );
}

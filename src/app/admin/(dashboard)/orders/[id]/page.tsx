import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { Card } from "@/components/admin/ui";
import { AdminOrderActions } from "@/components/admin/AdminOrderActions";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_META: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending_payment: { label: "Pending payment", bg: "bg-amber-100", text: "text-amber-700" },
  payment_review:  { label: "Payment review",  bg: "bg-blue-100",  text: "text-blue-700" },
  confirmed:       { label: "Confirmed",        bg: "bg-violet/10", text: "text-violet-deep" },
  packed:          { label: "Packed",           bg: "bg-violet/10", text: "text-violet-deep" },
  shipped:         { label: "Shipped",          bg: "bg-teal-100",  text: "text-teal-700" },
  delivered:       { label: "Delivered",        bg: "bg-emerald-100", text: "text-emerald-700" },
  cancelled:       { label: "Cancelled",        bg: "bg-rose-100",  text: "text-rose-600" },
};

const PAYMENT_LABELS: Record<string, string> = {
  faisal_bank: "Faisal Bank",
  nayapay:     "NayaPay",
  easypaisa:   "EasyPaisa",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const s = STATUS_META[order.status];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            <ArrowLeft size={14} /> Orders
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${s.bg} ${s.text}`}>
          {s.label}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {/* Items */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Items
            </h2>
            <ul className="divide-y divide-black/[0.05]">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-violet/10" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{it.name}</p>
                    {it.variantTitle && (
                      <p className="text-xs text-muted">{it.variantTitle}</p>
                    )}
                    <p className="text-xs text-muted">Qty {it.qty}</p>
                  </div>
                  <Link
                    href={`/shop/${it.slug}`}
                    target="_blank"
                    className="shrink-0 text-muted hover:text-violet-deep"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    {formatPrice(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-black/[0.06] pt-4">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-display text-lg font-semibold text-ink">
                {formatPrice(order.subtotal)}
              </span>
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Payment
            </h2>
            <p className="mb-3 text-sm text-ink">
              Method:{" "}
              <span className="font-medium">
                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </span>
            </p>
            {order.paymentScreenshotUrl ? (
              <div>
                <p className="mb-2 text-xs font-medium text-muted">Payment screenshot</p>
                <a
                  href={order.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.paymentScreenshotUrl}
                    alt="Payment screenshot"
                    className="max-h-72 w-auto rounded-xl border border-black/[0.08] object-contain transition-opacity hover:opacity-90"
                  />
                </a>
                <a
                  href={order.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-deep hover:underline"
                >
                  Open full size <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                No screenshot uploaded yet. Customer hasn&apos;t sent payment proof.
              </p>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Status update */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Update status
            </h2>
            <AdminOrderActions orderId={order.id} currentStatus={order.status} currentNotes={order.adminNotes ?? ""} />
          </Card>

          {/* Customer */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Customer
            </h2>
            <dl className="space-y-2 text-sm">
              <Row label="Name" value={order.fullName} />
              <Row label="Email" value={order.email} />
              <Row label="Phone" value={order.phone} />
              <Row label="Address" value={order.address} />
              <Row label="City" value={`${order.city}, ${order.country}`} />
            </dl>
          </Card>

          {/* Admin note */}
          {order.adminNotes && (
            <Card>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                Admin note
              </h2>
              <p className="text-sm text-ink">{order.adminNotes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

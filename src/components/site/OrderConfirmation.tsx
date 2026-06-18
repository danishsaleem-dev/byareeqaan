"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Copy,
  CheckCheck,
  CreditCard,
} from "lucide-react";
import { formatPrice, gradFor } from "@/lib/format";
import { UploadScreenshotForm } from "@/components/site/UploadScreenshotForm";
import type { Order, OrderStatus } from "@/lib/types";
import { useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const STATUS_STEPS: { id: OrderStatus; label: string; icon: React.ReactNode }[] =
  [
    { id: "pending_payment", label: "Pending payment", icon: <CreditCard size={16} /> },
    { id: "payment_review", label: "Payment review", icon: <Clock size={16} /> },
    { id: "confirmed", label: "Confirmed", icon: <CheckCircle2 size={16} /> },
    { id: "packed", label: "Packed", icon: <Package size={16} /> },
    { id: "shipped", label: "Shipped", icon: <Truck size={16} /> },
    { id: "delivered", label: "Delivered", icon: <MapPin size={16} /> },
  ];

const STATUS_ORDER: OrderStatus[] = [
  "pending_payment",
  "payment_review",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

const PAYMENT_LABELS: Record<string, string> = {
  faisal_bank: "Faisal Bank",
  nayapay: "NayaPay",
  easypaisa: "EasyPaisa",
};

const PAYMENT_DETAILS: Record<
  string,
  { label: string; value: string }[]
> = {
  faisal_bank: [
    { label: "Account Title", value: "AROOJ ZESHAN" },
    { label: "IBAN", value: "PK39FAYS3205443000005164" },
  ],
  nayapay: [
    { label: "Account Title", value: "AROOJ ZESHAN" },
    { label: "Account Number", value: "03364246604" },
  ],
  easypaisa: [
    { label: "Account Title", value: "AROOJ ZESHAN" },
    { label: "Account Number", value: "03364246604" },
  ],
};

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-violet transition-colors hover:bg-violet/10"
    >
      {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function OrderConfirmation({ order }: { order: Order }) {
  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  const paymentDetails = PAYMENT_DETAILS[order.paymentMethod];
  const needsPayment = order.status === "pending_payment";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
      {/* Hero checkmark */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-deep/10 text-violet-deep"
        >
          <CheckCircle2 size={40} strokeWidth={1.5} />
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease }}
        >
          <span className="text-xs font-medium uppercase tracking-luxe text-violet">
            Order placed
          </span>
          <h1 className="mt-2 font-display text-[clamp(2rem,5vw,2.75rem)] font-medium leading-tight text-ink">
            Thank you{order.fullName ? `, ${order.fullName.split(" ")[0]}` : ""}!
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your order{" "}
            <span className="font-semibold text-plum">{order.orderNumber}</span>{" "}
            has been placed.
          </p>
        </motion.div>
      </motion.div>

      {/* Status tracker */}
      {!isCancelled && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease }}
          className="mb-6 rounded-2xl border border-plum/10 bg-white p-5"
        >
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-violet-deep">
            Order status
          </h2>

          <ol className="relative space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              const upcoming = i > currentIndex;
              return (
                <li key={step.id} className="flex gap-4">
                  {/* Line + dot column */}
                  <div className="flex flex-col items-center">
                    <motion.span
                      initial={false}
                      animate={{
                        backgroundColor: done || active ? "#4c1d95" : "#e5e0f0",
                        scale: active ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                      style={{
                        color: done || active ? "#fff" : "#a09080",
                      }}
                    >
                      {done ? <CheckCheck size={15} /> : step.icon}
                    </motion.span>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-plum/10" />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pb-5 pt-1.5">
                    <p
                      className={`text-sm font-medium ${
                        active
                          ? "text-violet-deep"
                          : done
                            ? "text-ink"
                            : "text-muted/60"
                      }`}
                    >
                      {step.label}
                    </p>
                    {active && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-0.5 text-xs text-muted"
                      >
                        {step.id === "pending_payment" &&
                          "Waiting for your payment transfer."}
                        {step.id === "payment_review" &&
                          "We received your screenshot and are verifying it."}
                        {step.id === "confirmed" &&
                          "Payment confirmed! We're preparing your order."}
                        {step.id === "packed" && "Your order is packed and ready."}
                        {step.id === "shipped" &&
                          "On its way to you! We'll send tracking details."}
                        {step.id === "delivered" && "Delivered. Enjoy! ✨"}
                      </motion.p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.section>
      )}

      {/* Payment reminder (if not yet paid) */}
      {needsPayment && paymentDetails && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease }}
          className="mb-6 rounded-2xl border border-violet/20 bg-violet/5 p-5"
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet">
            Complete your payment
          </h2>
          <p className="mb-4 text-sm text-muted">
            Transfer{" "}
            <strong className="text-ink">{formatPrice(order.subtotal)}</strong>{" "}
            to{" "}
            <strong className="text-ink">
              {PAYMENT_LABELS[order.paymentMethod]}
            </strong>
            :
          </p>
          <dl className="space-y-2.5">
            {paymentDetails.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between gap-2"
              >
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="flex items-center text-sm font-semibold text-ink">
                  {f.value}
                  <CopyBtn value={f.value} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 border-t border-violet/15 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet">
              Upload your payment screenshot
            </p>
            <p className="mb-3 text-xs text-muted">
              Upload here directly — or send it on{" "}
              <a href="https://wa.me/923364246604" target="_blank" rel="noopener noreferrer" className="font-medium text-violet underline">WhatsApp</a>
              {" "}or{" "}
              <a href="https://instagram.com/byareeqaan" target="_blank" rel="noopener noreferrer" className="font-medium text-violet underline">Instagram</a>
              {" "}with your order number <strong className="text-plum">{order.orderNumber}</strong>.
            </p>
            <UploadScreenshotForm orderId={order.id} />
          </div>
        </motion.section>
      )}

      {/* Order summary */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5, ease }}
        className="mb-6 rounded-2xl border border-plum/10 bg-white p-5"
      >
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-violet-deep">
          Order summary
        </h2>
        <ul className="space-y-3">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center gap-3">
              <div
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
                style={{ background: gradFor(it.productId) }}
              >
                {it.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                {it.variantTitle && (
                  <p className="text-xs text-muted">{it.variantTitle}</p>
                )}
                <p className="text-xs text-muted">Qty {it.qty}</p>
              </div>
              <span className="text-sm font-semibold text-violet-deep">
                {formatPrice(it.price * it.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-plum/10 pt-4">
          <span className="text-sm text-muted">Subtotal</span>
          <span className="font-display text-lg font-semibold text-ink">
            {formatPrice(order.subtotal)}
          </span>
        </div>

        {/* Delivery info */}
        <div className="mt-4 space-y-1 border-t border-plum/10 pt-4 text-sm text-muted">
          <p>
            <span className="font-medium text-ink">Ship to: </span>
            {order.fullName} · {order.address}, {order.city}, {order.country}
          </p>
          <p>
            <span className="font-medium text-ink">Contact: </span>
            {order.phone} · {order.email}
          </p>
        </div>
      </motion.section>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5, ease }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Link
          href="/account"
          className="flex flex-1 items-center justify-center rounded-full bg-violet-deep px-6 py-3.5 text-sm font-semibold text-ivory shadow-soft transition-colors hover:bg-violet"
        >
          View my orders
        </Link>
        <Link
          href="/shop"
          className="flex flex-1 items-center justify-center rounded-full border border-plum/20 px-6 py-3.5 text-sm font-medium text-plum transition-colors hover:border-violet hover:text-violet-deep"
        >
          Continue shopping
        </Link>
      </motion.div>
    </main>
  );
}

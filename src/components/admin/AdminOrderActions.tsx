"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/app/admin/actions";
import type { OrderStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending_payment", label: "Pending payment" },
  { value: "payment_review",  label: "Payment review" },
  { value: "confirmed",       label: "Confirmed" },
  { value: "packed",          label: "Packed" },
  { value: "shipped",         label: "Shipped" },
  { value: "delivered",       label: "Delivered" },
  { value: "cancelled",       label: "Cancelled" },
];

export function AdminOrderActions({
  orderId,
  currentStatus,
  currentNotes,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  currentNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, status, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-xl border border-black/[0.12] bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-violet focus:ring-2 focus:ring-violet/15"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Admin note (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Payment confirmed via NayaPay, packed and ready"
          rows={3}
          className="w-full resize-none rounded-xl border border-black/[0.12] bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-violet focus:ring-2 focus:ring-violet/15"
        />
      </div>

      <button
        onClick={save}
        disabled={pending}
        className="w-full rounded-xl bg-violet-deep px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet disabled:opacity-60"
      >
        {pending ? "Saving…" : saved ? "Saved ✓" : "Update order"}
      </button>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Upload,
  CheckCircle2,
  Copy,
  ChevronDown,
} from "lucide-react";
import { useBag } from "@/lib/bag";
import { formatPrice, gradFor } from "@/lib/format";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import {
  placeOrderAction,
  createScreenshotUploadAction,
  getScreenshotUrlAction,
} from "@/app/(site)/checkout/actions";
import type { PaymentMethod, OrderItem } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  detail: string;
  fields: { label: string; value: string }[];
}[] = [
  {
    id: "faisal_bank",
    label: "Faisal Bank",
    detail: "Bank transfer",
    fields: [
      { label: "Account Title", value: "AROOJ ZESHAN" },
      { label: "IBAN", value: "PK39FAYS3205443000005164" },
    ],
  },
  {
    id: "nayapay",
    label: "NayaPay",
    detail: "Mobile wallet",
    fields: [
      { label: "Account Title", value: "AROOJ ZESHAN" },
      { label: "Account Number", value: "03364246604" },
    ],
  },
  {
    id: "easypaisa",
    label: "EasyPaisa",
    detail: "Mobile wallet",
    fields: [
      { label: "Account Title", value: "AROOJ ZESHAN" },
      { label: "Account Number", value: "03364246604" },
    ],
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-violet transition-colors hover:bg-violet/10"
    >
      {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-plum">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-plum/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-violet focus:ring-2 focus:ring-violet/15";

export function CheckoutForm({
  prefillName,
  prefillEmail,
  prefillPhone,
  prefillAddress,
  prefillCity,
}: {
  prefillName?: string;
  prefillEmail?: string;
  prefillPhone?: string;
  prefillAddress?: string;
  prefillCity?: string;
}) {
  const router = useRouter();
  const { items, subtotal, clear } = useBag();

  const [fullName, setFullName] = useState(prefillName ?? "");
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [phone, setPhone] = useState(prefillPhone ?? "");
  const [address, setAddress] = useState(prefillAddress ?? "");
  const [city, setCity] = useState(prefillCity ?? "");
  const [country] = useState("Pakistan");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<
    "idle" | "uploading" | "placing" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const selectedOption = PAYMENT_OPTIONS.find((o) => o.id === paymentMethod);

  function handleFile(file: File) {
    setScreenshot(file);
    const url = URL.createObjectURL(file);
    setScreenshotPreview(url);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (!items.length) {
      setError("Your bag is empty.");
      return;
    }

    setError(null);
    let screenshotUrl: string | undefined;

    try {
      if (screenshot) {
        setStatus("uploading");
        const { path, token } = await createScreenshotUploadAction(
          screenshot.name,
        );
        const sb = createSupabaseBrowser();
        const { error: upErr } = await sb.storage
          .from("media")
          .uploadToSignedUrl(path, token, screenshot, {
            contentType: screenshot.type,
          });
        if (upErr) throw upErr;
        screenshotUrl = await getScreenshotUrlAction(path);
      }

      setStatus("placing");
      const orderItems: OrderItem[] = items.map((i) => ({
        productId: i.productId,
        slug: i.slug,
        name: i.name,
        image: i.image,
        price: i.price,
        variantId: i.variantId,
        variantTitle: i.variantTitle,
        qty: i.qty,
        notes: i.notes,
      }));

      const { id } = await placeOrderAction({
        email,
        fullName,
        phone,
        address,
        city,
        country,
        items: orderItems,
        subtotal,
        paymentMethod,
        paymentScreenshotUrl: screenshotUrl,
      });

      clear();
      router.push(`/orders/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  const busy = status === "uploading" || status === "placing";

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Order summary */}
      <section className="rounded-2xl border border-plum/10 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-deep">
          Your bag
        </h2>
        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={`${it.productId}:${it.variantId ?? ""}`}
              className="flex items-center gap-3"
            >
              <div
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"
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
                <p className="truncate text-sm font-medium text-ink">
                  {it.name}
                </p>
                {it.variantTitle && (
                  <p className="text-xs text-muted">{it.variantTitle}</p>
                )}
                <p className="text-xs text-muted">Qty {it.qty}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-violet-deep">
                {formatPrice(it.price * it.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-plum/10 pt-4">
          <span className="text-sm text-muted">Subtotal</span>
          <span className="font-display text-xl font-semibold text-ink">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          Free delivery in Pakistan on orders over Rs 5,000 · We also ship
          worldwide.
        </p>
      </section>

      {/* Customer info */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-deep">
          Your details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Areeqaan Zeshan"
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>
        </div>
        <Field label="Phone number">
          <div className="relative">
            <Phone
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX XXXXXXX"
              className={`${inputCls} pl-10`}
            />
          </div>
        </Field>
        <Field label="Street address">
          <div className="relative">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3.5 top-3.5 text-muted"
            />
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no., street, area"
              rows={2}
              className={`${inputCls} resize-none pl-10`}
            />
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City">
            <input
              required
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lahore"
              className={inputCls}
            />
          </Field>
          <Field label="Country">
            <input
              type="text"
              value={country}
              readOnly
              className={`${inputCls} bg-cream/40`}
            />
          </Field>
        </div>
      </section>

      {/* Payment method */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-deep">
          Payment method
        </h2>
        <p className="text-sm text-muted">
          Transfer the amount to one of the accounts below, then upload your
          payment screenshot. We&apos;ll confirm your order once payment is
          verified.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPaymentMethod(opt.id)}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                paymentMethod === opt.id
                  ? "border-violet bg-violet/5 ring-2 ring-violet/20"
                  : "border-plum/10 bg-white hover:border-violet/40"
              }`}
            >
              <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-deep/10">
                <CreditCard size={16} className="text-violet-deep" />
              </span>
              <span className="text-sm font-semibold text-ink">{opt.label}</span>
              <span className="text-xs text-muted">{opt.detail}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedOption && (
            <motion.div
              key={selectedOption.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-2xl border border-violet/20 bg-violet/5 p-5"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet">
                Transfer to:
              </p>
              <dl className="space-y-2">
                {selectedOption.fields.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-2">
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="flex items-center text-sm font-medium text-ink">
                      {f.value}
                      <CopyButton value={f.value} />
                    </dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-xs text-muted">Amount</dt>
                  <dd className="text-sm font-semibold text-violet-deep">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Screenshot upload */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-deep">
          Payment screenshot{" "}
          <span className="ml-1 text-[10px] font-normal normal-case text-muted">
            (optional but speeds up confirmation)
          </span>
        </h2>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {screenshotPreview ? (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotPreview}
              alt="Payment screenshot"
              className="h-32 w-auto rounded-xl border border-plum/10 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setScreenshot(null);
                setScreenshotPreview(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-plum/20 bg-cream/30 py-6 text-sm text-muted transition-colors hover:border-violet/40 hover:text-violet"
          >
            <Upload size={18} />
            Tap to upload screenshot
          </button>
        )}
      </section>

      {/* Error */}
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={busy}
        whileHover={{ scale: busy ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-deep px-8 py-4 text-base font-semibold text-ivory shadow-soft transition-colors hover:bg-violet disabled:opacity-60"
      >
        {status === "uploading"
          ? "Uploading screenshot…"
          : status === "placing"
            ? "Placing your order…"
            : "Place order"}
      </motion.button>

      <p className="text-center text-xs text-muted">
        By placing your order you agree to our{" "}
        <a href="/terms" className="underline hover:text-plum">
          terms
        </a>
        . Payment is manual — we&apos;ll confirm once we verify your transfer.
      </p>
    </form>
  );
}

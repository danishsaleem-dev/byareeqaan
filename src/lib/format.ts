import { site } from "./site";

/** Deterministic on-brand gradient so each item gets a stable placeholder. */
const GRADS = [
  "linear-gradient(155deg,#6d28d9,#a78bfa)",
  "linear-gradient(155deg,#4c1d95,#8b5cf6)",
  "linear-gradient(155deg,#7c3aed,#c4b5fd)",
  "linear-gradient(155deg,#5b21b6,#a855f7)",
  "linear-gradient(155deg,#6d28d9,#c0a06a)",
  "linear-gradient(155deg,#4338ca,#8b5cf6)",
  "linear-gradient(155deg,#7e22ce,#e9d5ff)",
  "linear-gradient(155deg,#5b21b6,#c084fc)",
];

export function gradFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADS[h % GRADS.length];
}

/** Format a number as a PKR price, e.g. 1499 → "Rs 1,499". */
export function formatPrice(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  return `Rs ${Math.round(n).toLocaleString("en-US")}`;
}

/** Percentage saved when a compare-at price is present. */
export function discountPercent(
  price: number,
  comparePrice: number | null,
): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

const WA = `https://wa.me/${site.whatsapp.number}`;

/** Generic WhatsApp link with an optional prefilled message. */
export function waLink(message?: string): string {
  return message ? `${WA}?text=${encodeURIComponent(message)}` : WA;
}

/** WhatsApp order link prefilled with product details. */
export function productWaLink(opts: {
  name: string;
  variant?: string;
  price?: number;
  url?: string;
}): string {
  const lines = [`Hi By Areeqaan! I'd like to order:`, ``, `• ${opts.name}`];
  if (opts.variant) lines.push(`• Option: ${opts.variant}`);
  if (opts.price != null) lines.push(`• Price: ${formatPrice(opts.price)}`);
  if (opts.url) lines.push(``, opts.url);
  lines.push(``, `Is it available? ✨`);
  return waLink(lines.join("\n"));
}

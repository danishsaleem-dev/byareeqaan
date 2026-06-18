"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Minus, Plus, Package, RefreshCw, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent, productWaLink } from "@/lib/format";
import { useBag } from "@/lib/bag";
import { WhatsAppIcon, InstagramIcon } from "@/components/BrandIcons";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useBag();
  const variants = product.variants.filter((v) => v.available !== false);
  const [variantId, setVariantId] = useState<string | null>(
    variants.length ? variants[0].id : null,
  );
  const variant = variants.find((v) => v.id === variantId) ?? null;
  const [qty, setQty] = useState(1);

  const price = variant?.price && variant.price > 0 ? variant.price : product.price;
  const off = discountPercent(price, product.comparePrice);
  const sold = product.sold;
  const stock = product.stock;
  const overStock = stock != null && qty > stock;

  const wa = productWaLink({
    name: product.name,
    variant: variant?.title,
    price,
  });

  function addToBag() {
    const primary = product.images.find((i) => i.primary) ?? product.images[0];
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: primary?.url,
        price,
        variantId: variant?.id,
        variantTitle: variant?.title,
        stock,
      },
      qty,
    );
  }

  return (
    <div className="lg:py-2">
      {product.material && (
        <span className="text-xs font-medium uppercase tracking-luxe text-violet">
          {product.material}
        </span>
      )}

      <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.2rem)] font-medium leading-[1.02] text-ink">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-display text-3xl font-semibold text-violet-deep">
          {formatPrice(price)}
        </span>
        {product.comparePrice && product.comparePrice > price && (
          <span className="text-lg text-muted line-through">
            {formatPrice(product.comparePrice)}
          </span>
        )}
        {off && (
          <span className="rounded-full bg-violet-deep/10 px-3 py-1 text-xs font-medium text-violet-deep">
            Save {off}%
          </span>
        )}
      </div>

      {product.shortDesc && (
        <p className="mt-5 text-base leading-relaxed text-muted">
          {product.shortDesc}
        </p>
      )}

      {/* stock hint */}
      {!sold && stock != null && (
        <p className="mt-4 text-sm text-muted">
          {stock > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {stock <= 5 ? `Only ${stock} left in stock` : "In stock"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Made to order
            </span>
          )}
        </p>
      )}

      {!sold && variants.length > 0 && (
        <div className="mt-7">
          <p className="mb-2.5 text-sm font-medium text-plum">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  v.id === variantId
                    ? "border-violet-deep bg-violet-deep text-ivory"
                    : "border-plum/15 text-plum hover:border-violet/40"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {sold ? (
        /* ── Sold: request to order ───────────────────────────── */
        <div className="mt-8">
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
            This piece is currently <strong>sold out</strong>. Request it and
            we&apos;ll let you know if we can recreate or restock it for you.
          </div>
          <motion.a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2, ease }}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-violet-deep px-8 py-4 text-base font-medium text-ivory shadow-soft transition-colors hover:bg-violet"
          >
            <WhatsAppIcon size={20} /> Request to order
          </motion.a>
        </div>
      ) : (
        /* ── Available: quantity + add to bag ─────────────────── */
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-plum/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center text-plum transition-colors hover:text-violet-deep"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-base font-medium text-ink">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center text-plum transition-colors hover:text-violet-deep"
              >
                <Plus size={16} />
              </button>
            </div>

            <motion.button
              onClick={addToBag}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, ease }}
              className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-violet-deep px-8 py-4 text-base font-medium text-ivory shadow-soft transition-colors hover:bg-violet"
            >
              <ShoppingBag size={19} /> Add to bag
            </motion.button>
          </div>

          {overStock && (
            <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-700">
              Only {stock} in stock right now. You can still order {qty} — we&apos;ll
              confirm if we can get the rest to you in time.
            </p>
          )}

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-plum/15 px-8 py-3.5 text-sm font-medium text-plum transition-colors hover:border-violet hover:text-violet-deep"
          >
            <WhatsAppIcon size={18} /> Ask about this piece
          </a>
        </div>
      )}

      <a
        href={site.socials.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full px-8 py-2.5 text-sm font-medium text-plum transition-colors hover:text-violet-deep"
      >
        <InstagramIcon size={18} /> See more on Instagram
      </a>

      {/* trust strip */}
      <div className="mt-8 grid grid-cols-3 gap-2 border-t border-plum/10 pt-6">
        {[
          { Icon: Truck, label: "Pakistan-wide & worldwide" },
          { Icon: Package, label: "Hand-wrapped to gift" },
          { Icon: RefreshCw, label: "Easy exchanges" },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-2 text-center">
            <t.Icon size={18} className="text-violet-deep" />
            <span className="text-[11px] leading-tight text-muted">{t.label}</span>
          </div>
        ))}
      </div>

      {product.sku && (
        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
          <Check size={13} className="text-violet" /> SKU: {product.sku}
        </p>
      )}
    </div>
  );
}

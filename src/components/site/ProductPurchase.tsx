"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Package, RefreshCw, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent, productWaLink } from "@/lib/format";
import { WhatsAppIcon, InstagramIcon } from "@/components/BrandIcons";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function ProductPurchase({ product }: { product: Product }) {
  const variants = product.variants.filter((v) => v.available !== false);
  const [variantId, setVariantId] = useState<string | null>(
    variants.length ? variants[0].id : null,
  );
  const variant = variants.find((v) => v.id === variantId) ?? null;

  const price = variant?.price && variant.price > 0 ? variant.price : product.price;
  const off = discountPercent(price, product.comparePrice);

  const wa = productWaLink({
    name: product.name,
    variant: variant?.title,
    price,
  });

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

      {variants.length > 0 && (
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

      <motion.a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2, ease }}
        className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-violet-deep px-8 py-4 text-base font-medium text-ivory shadow-soft transition-colors hover:bg-violet"
      >
        <WhatsAppIcon size={20} /> Order on WhatsApp
      </motion.a>

      <a
        href={site.socials.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-plum/15 px-8 py-3.5 text-sm font-medium text-plum transition-colors hover:border-violet hover:text-violet-deep"
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

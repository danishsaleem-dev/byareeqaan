import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent, gradFor } from "@/lib/format";
import { SmartImage } from "./SmartImage";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
}) {
  const primary = product.images.find((i) => i.primary) ?? product.images[0];
  const off = discountPercent(product.price, product.comparePrice);

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem] shadow-card">
        <SmartImage
          src={primary?.url}
          alt={product.name}
          grad={gradFor(product.id)}
          eager={eager}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />

        {/* shine sweep */}
        <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.sold && (
            <span className="rounded-full bg-rose-500/90 px-2.5 py-1 text-[11px] font-medium text-white shadow">
              Sold
            </span>
          )}
          {!product.sold && off && (
            <span className="rounded-full bg-violet-deep px-2.5 py-1 text-[11px] font-medium text-ivory shadow">
              −{off}%
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-gold/90 px-2.5 py-1 text-[11px] font-medium text-ink shadow">
              Loved
            </span>
          )}
        </div>

        {/* wishlist */}
        <WishlistButton
          productId={product.id}
          size={16}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/85 text-plum shadow-sm backdrop-blur transition-all hover:bg-ivory hover:text-rose-500 z-10"
        />

        {/* view cue */}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-ivory/90 text-violet-deep opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
        <div className="pointer-events-none absolute inset-0 rounded-[1.3rem] ring-1 ring-inset ring-white/10" />
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="font-display text-xl font-medium leading-tight text-ink transition-colors group-hover:text-violet-deep">
          {product.name}
        </h3>
        {product.material && (
          <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">
            {product.material}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-violet-deep">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
          {product.sold && (
            <span className="ml-auto text-[11px] font-medium text-rose-500">
              Request to order
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

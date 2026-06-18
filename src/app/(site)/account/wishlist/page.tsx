import Link from "next/link";
import { Heart } from "lucide-react";
import { getWishlistIds } from "@/lib/wishlist";
import { getProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { WishlistButton } from "@/components/site/WishlistButton";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const ids = await getWishlistIds();

  const products = ids.length
    ? (await Promise.all(ids.map((id) => getProduct(id).catch(() => null)))).filter(
        (p): p is Product => p !== null && p.status === "published",
      )
    : [];

  return (
    <div>
      <h2 className="mb-5 font-display text-2xl font-medium text-ink">
        Wishlist
        {products.length > 0 && (
          <span className="ml-2 text-base font-normal text-muted">
            ({products.length})
          </span>
        )}
      </h2>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum/15 bg-cream/30 py-12 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-400">
            <Heart size={24} />
          </span>
          <p className="text-sm font-medium text-ink">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-violet-deep px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-violet"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}

function WishlistCard({ product }: { product: Product }) {
  const image = product.images.find((i) => i.primary)?.url ?? product.images[0]?.url;
  return (
    <li className="group relative rounded-2xl border border-plum/10 bg-white p-4 transition-all hover:border-violet/30 hover:shadow-soft">
      <div className="flex gap-4">
        <Link href={`/shop/${product.slug}`} className="shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-xl bg-violet/10">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/shop/${product.slug}`}>
            <p className="font-medium text-ink transition-colors group-hover:text-violet-deep">
              {product.name}
            </p>
          </Link>
          {product.material && (
            <p className="mt-0.5 text-xs text-muted">{product.material}</p>
          )}
          <p className="mt-1 text-sm font-semibold text-violet-deep">
            {formatPrice(product.price)}
          </p>
          {product.sold && (
            <span className="mt-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-600">
              Sold out
            </span>
          )}
        </div>
        <WishlistButton
          productId={product.id}
          initialWishlisted
          size={18}
          className="shrink-0 self-start rounded-full p-1.5 text-rose-500 transition-colors hover:bg-rose-50"
        />
      </div>
      <Link
        href={`/shop/${product.slug}`}
        className="mt-3 flex w-full items-center justify-center rounded-full border border-plum/15 py-2 text-sm font-medium text-plum transition-colors hover:border-violet hover:text-violet-deep"
      >
        View product
      </Link>
    </li>
  );
}

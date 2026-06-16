import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  getPublishedProductBySlug,
  listPublishedProducts,
} from "@/lib/data";
import { gradFor } from "@/lib/format";
import { site } from "@/lib/site";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductPurchase } from "@/components/site/ProductPurchase";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return { title: "Not found — By Areeqaan" };
  const title = product.seoTitle || `${product.name} — ${site.name}`;
  const description = product.seoDesc || product.shortDesc || site.description;
  const image = product.images.find((i) => i.primary)?.url ?? product.images[0]?.url;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();

  // Related: same collection first, then fill with the newest others.
  const all = await listPublishedProducts();
  const others = all.filter((p) => p.id !== product.id);
  const sameCollection = others.filter((p) =>
    p.collectionIds.some((id) => product.collectionIds.includes(id)),
  );
  const related = [
    ...sameCollection,
    ...others.filter((p) => !sameCollection.includes(p)),
  ].slice(0, 4);

  const grad = gradFor(product.id);

  return (
    <main className="pt-28 sm:pt-32">
      {/* breadcrumb */}
      <nav className="mx-auto mb-6 flex max-w-6xl items-center gap-1.5 px-5 text-xs text-muted sm:px-6">
        <Link href="/" className="transition-colors hover:text-violet-deep">
          Home
        </Link>
        <ChevronRight size={13} />
        <Link href="/shop" className="transition-colors hover:text-violet-deep">
          Shop
        </Link>
        <ChevronRight size={13} />
        <span className="truncate text-plum">{product.name}</span>
      </nav>

      {/* main */}
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images}
          videos={product.videos}
          name={product.name}
          grad={grad}
        />
        <ProductPurchase product={product} />
      </div>

      {/* full description */}
      {product.fullDesc && (
        <section className="mx-auto mt-20 max-w-3xl px-5 sm:px-6">
          <Reveal className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
            <span className="h-px w-8 bg-violet" /> The details
          </Reveal>
          <div className="space-y-4 text-base leading-relaxed text-muted">
            {product.fullDesc.split("\n").filter(Boolean).map((para, i) => (
              <Reveal key={i} i={i} as="p">
                {para}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* related */}
      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-6xl px-5 pb-28 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-none text-ink">
              You may also <span className="italic text-gradient">love</span>
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-violet-deep transition-colors hover:text-violet"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

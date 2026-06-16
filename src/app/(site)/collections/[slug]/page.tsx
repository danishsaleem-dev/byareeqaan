import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionBySlug, listPublishedProducts } from "@/lib/data";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopBrowser } from "@/components/site/ShopBrowser";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Not found — By Areeqaan" };
  return {
    title: `${collection.name} — ${site.name}`,
    description: collection.description || site.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const all = await listPublishedProducts();
  const products = all.filter((p) => p.collectionIds.includes(collection.id));

  return (
    <main>
      <PageHeader
        eyebrow="Collection"
        title={collection.name}
        subtitle={collection.description || undefined}
      >
        <Link
          href="/collections"
          className="text-sm font-medium text-violet-deep transition-colors hover:text-violet"
        >
          ← All collections
        </Link>
      </PageHeader>
      <ShopBrowser products={products} collections={[]} />
    </main>
  );
}

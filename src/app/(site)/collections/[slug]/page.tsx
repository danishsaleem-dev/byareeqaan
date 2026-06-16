import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionBySlug, listCollections, listPublishedProducts } from "@/lib/data";
import { site } from "@/lib/site";
import { absUrl, collectionLd, breadcrumbLd } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopBrowser } from "@/components/site/ShopBrowser";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 300;

const getCol = cache(getCollectionBySlug);

export async function generateStaticParams() {
  try {
    const cols = await listCollections();
    return cols.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCol(slug);
  if (!collection) return { title: "Not found" };
  const description = collection.description || site.description;
  const canonical = `/collections/${collection.slug}`;
  return {
    title: collection.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${collection.name} — ${site.name}`,
      description,
      type: "website",
      url: absUrl(canonical),
      images: collection.imageUrl ? [{ url: collection.imageUrl }] : undefined,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCol(slug);
  if (!collection) notFound();

  const all = await listPublishedProducts();
  const products = all.filter((p) => p.collectionIds.includes(collection.id));

  return (
    <main>
      <JsonLd
        data={[
          collectionLd(collection, products),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: collection.name, path: `/collections/${collection.slug}` },
          ]),
        ]}
      />
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

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listCollections, listPublishedProducts } from "@/lib/data";
import { gradFor } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { SmartImage } from "@/components/site/SmartImage";
import { EmptyState } from "@/components/site/EmptyState";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore By Areeqaan's edits of minimal, modern jewellery — necklaces, rings, earrings and more.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([
    listCollections(),
    listPublishedProducts(),
  ]);

  const withMeta = collections.map((c) => {
    const items = products.filter((p) => p.collectionIds.includes(c.id));
    const preview =
      c.imageUrl ||
      items.find((p) => p.images.find((i) => i.primary))?.images.find((i) => i.primary)?.url ||
      items[0]?.images[0]?.url;
    return { ...c, count: items.length, preview };
  });

  return (
    <main>
      <PageHeader
        eyebrow="Collections"
        title={
          <>
            Curated <span className="italic text-gradient">edits</span>
          </>
        }
        subtitle="Eight ways to find your everyday signature. Tap an edit to explore the pieces inside."
      />

      <div className="mx-auto max-w-6xl px-5 pb-28 sm:px-6">
        {withMeta.length === 0 ? (
          <EmptyState
            title="Collections coming soon"
            message="We're organising the edits right now. Message us and we'll show you what's available."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withMeta.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group relative flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-[1.5rem] p-6 text-ivory shadow-card"
              >
                <SmartImage
                  src={c.preview}
                  alt={c.name}
                  grad={gradFor(c.id)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-deep/70 via-violet-deep/10 to-transparent" />
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <h2 className="font-display text-3xl font-medium">{c.name}</h2>
                    <p className="mt-1 text-sm text-ivory/80">
                      {c.count} {c.count === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-violet-deep">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

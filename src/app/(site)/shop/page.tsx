import type { Metadata } from "next";
import { listPublishedProducts, listCollections } from "@/lib/data";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopBrowser } from "@/components/site/ShopBrowser";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full edit of minimal, trend-led jewellery by By Areeqaan. Filter by price, material and collection, then order on WhatsApp.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, collections] = await Promise.all([
    listPublishedProducts(),
    listCollections(),
  ]);

  return (
    <main>
      <PageHeader
        eyebrow="Shop"
        title={
          <>
            The full <span className="italic text-gradient">edit</span>
          </>
        }
        subtitle="Every piece, in one place. Filter by collection, find your signature, and order in minutes on WhatsApp."
      />
      <ShopBrowser products={products} collections={collections} />
    </main>
  );
}

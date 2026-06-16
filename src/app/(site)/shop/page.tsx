import type { Metadata } from "next";
import { listPublishedProducts, listCollections } from "@/lib/data";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopBrowser } from "@/components/site/ShopBrowser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — By Areeqaan",
  description:
    "Browse the full edit of minimal, trend-led jewellery by By Areeqaan. Filter by collection and order on WhatsApp.",
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

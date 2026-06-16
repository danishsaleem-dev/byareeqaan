import { getHomepage, listPublishedProducts, listCollections } from "@/lib/data";
import { HeroImage } from "@/components/HeroImage";
import { Marquee } from "@/components/Marquee";
import { Collections } from "@/components/Collections";
import { Story } from "@/components/Story";
import { Promise as PromiseSection } from "@/components/Promise";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Guarantee } from "@/components/site/Guarantee";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [homepage, products, collections] = await Promise.all([
    getHomepage(),
    listPublishedProducts(),
    listCollections(),
  ]);

  // Hero gallery: admin-uploaded hero images → else real product photos → else
  // the component's built-in placeholders.
  const heroImages = homepage.hero.images?.length
    ? homepage.hero.images.map((src) => ({ src }))
    : products
        .map((p) => {
          const im = p.images.find((i) => i.primary) ?? p.images[0];
          return im ? { src: im.url, label: p.name } : null;
        })
        .filter((x): x is { src: string; label: string } => x !== null)
        .slice(0, 8);

  // Featured first, then newest.
  const featured = [...products]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 8);

  return (
    <main>
      <HeroImage
        hero={homepage.hero}
        images={heroImages.length ? heroImages : undefined}
      />
      <Marquee />
      <FeaturedProducts products={featured} />
      <Collections data={collections} />
      <Story data={homepage.story} />
      <PromiseSection />
      <Guarantee />
      <Testimonials />
      <Contact data={homepage.contact} />
    </main>
  );
}

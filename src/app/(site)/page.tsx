import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HeroImage } from "@/components/HeroImage";
import { Marquee } from "@/components/Marquee";
import { Collections } from "@/components/Collections";
import { Story } from "@/components/Story";
import { Promise as PromiseSection } from "@/components/Promise";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string }>;
}) {
  const { hero } = await searchParams;
  const imageBanner = hero === "imagebanner";

  return (
    <>
      <Navbar />
      <main>
        {imageBanner ? <HeroImage /> : <Hero />}
        <Marquee />
        <Collections />
        <Story />
        <PromiseSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      {/* Preview switcher — only shows while previewing the image banner */}
      {imageBanner && (
        <Link
          href="/"
          className="fixed bottom-5 left-5 z-[60] inline-flex items-center gap-2 rounded-full border border-violet/20 bg-ivory/90 px-4 py-2 text-xs font-medium text-plum shadow-soft backdrop-blur transition-colors hover:border-violet hover:text-violet-deep"
        >
          ← Back to default banner
        </Link>
      )}
    </>
  );
}

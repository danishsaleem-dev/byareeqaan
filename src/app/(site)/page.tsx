import { Navbar } from "@/components/Navbar";
import { HeroImage } from "@/components/HeroImage";
import { Marquee } from "@/components/Marquee";
import { Collections } from "@/components/Collections";
import { Story } from "@/components/Story";
import { Promise as PromiseSection } from "@/components/Promise";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroImage />
        <Marquee />
        <Collections />
        <Story />
        <PromiseSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

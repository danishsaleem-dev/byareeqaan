import type { Metadata } from "next";
import { getHomepage } from "@/lib/data";
import { Story } from "@/components/Story";
import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/site/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our story — By Areeqaan",
  description:
    "By Areeqaan began as a love letter to minimal, modern adornment — jewellery that feels personal, never loud.",
};

export default async function StoryPage() {
  const homepage = await getHomepage();

  return (
    <main>
      <PageHeader
        eyebrow="Our story"
        title={
          <>
            Tiny details.{" "}
            <span className="italic text-gradient">Big intentions.</span>
          </>
        }
        subtitle="A small, growing label crafting minimal jewellery for the modern muse — delivered with care across Pakistan and worldwide."
      />
      <Story data={homepage.story} />
      <Contact data={homepage.contact} />
    </main>
  );
}

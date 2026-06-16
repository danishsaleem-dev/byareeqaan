import type { Metadata } from "next";
import { Story } from "@/components/Story";
import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Our story — By Areeqaan",
  description:
    "By Areeqaan began as a love letter to minimal, modern adornment — jewellery that feels personal, never loud.",
};

export default function StoryPage() {
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
      <Story />
      <Contact />
    </main>
  );
}

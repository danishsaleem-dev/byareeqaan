import type { Metadata } from "next";
import { getHomepage } from "@/lib/data";
import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/site/PageHeader";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Message By Areeqaan on WhatsApp or social media to order, style and ship minimal jewellery anywhere.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const homepage = await getHomepage();

  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Say <span className="italic text-gradient">hello</span>
          </>
        }
        subtitle="We're a message away. Reach us on WhatsApp or social and we'll help you pick, style and ship."
      />
      <Contact data={homepage.contact} />
    </main>
  );
}

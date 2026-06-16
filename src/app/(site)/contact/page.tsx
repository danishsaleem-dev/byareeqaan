import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Contact — By Areeqaan",
  description:
    "Message By Areeqaan on WhatsApp or social media to order, style and ship minimal jewellery anywhere.",
};

export default function ContactPage() {
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
      <Contact />
    </main>
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How By Areeqaan collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main>
      <LegalPage
        title="Privacy policy"
        intro="Your trust matters to us. Here's how we handle the information you share."
        updated="June 2026"
        sections={[
          {
            heading: "What we collect",
            body: [
              "When you place an order or message us, we collect the details you provide — your name, contact number, delivery address and order preferences. We only ask for what's needed to fulfil and deliver your order.",
              "We do not collect or store any payment card details on this website.",
            ],
          },
          {
            heading: "How we use it",
            body: [
              "Your information is used solely to process orders, arrange delivery, respond to your messages, and occasionally share new collections or offers if you've asked us to.",
              "We never sell your personal information to anyone.",
            ],
          },
          {
            heading: "Messaging & social",
            body: [
              `Orders are placed through WhatsApp (${site.whatsapp.display}) and our social channels. Conversations on those platforms are also governed by their own privacy policies.`,
            ],
          },
          {
            heading: "Your choices",
            body: [
              "You can ask us at any time to see, update or delete the information we hold about you, or to stop receiving updates — just message us.",
            ],
          },
          {
            heading: "Contact",
            body: [
              `Questions about your privacy? Reach us on WhatsApp at ${site.whatsapp.display} or on Instagram ${site.socials.instagram.handle}.`,
            ],
          },
        ]}
      />
    </main>
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping and delivery information for By Areeqaan jewellery orders.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <main>
      <LegalPage
        title="Shipping & delivery"
        intro="Hand-wrapped with care and sent across Pakistan and around the world."
        updated="June 2026"
        sections={[
          {
            heading: "Where we deliver",
            body: [
              "We deliver all over Pakistan and ship internationally. Wherever you are, we'll find a way to get your pieces to you.",
            ],
          },
          {
            heading: "Processing time",
            body: [
              "Orders are confirmed and packed within 1–2 working days. You'll get a heads-up on WhatsApp once your order is on its way.",
            ],
          },
          {
            heading: "Delivery estimates",
            body: [
              "Within Pakistan: typically 2–5 working days depending on your city.",
              "International: typically 7–14 working days depending on the destination and customs.",
            ],
          },
          {
            heading: "Charges",
            body: [
              "Shipping charges (if any) are confirmed on WhatsApp before you pay, so there are never any surprises. Any customs duties on international orders are the responsibility of the recipient.",
            ],
          },
          {
            heading: "Tracking",
            body: [
              `We'll share tracking details on WhatsApp as soon as your order ships. Questions? Message us at ${site.whatsapp.display}.`,
            ],
          },
        ]}
      />
    </main>
  );
}

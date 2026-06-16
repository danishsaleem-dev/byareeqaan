import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service — By Areeqaan",
  description: "The terms that apply when you shop with By Areeqaan.",
};

export default function TermsPage() {
  return (
    <main>
      <LegalPage
        title="Terms of service"
        intro="The simple terms that apply when you browse and order from By Areeqaan."
        updated="June 2026"
        sections={[
          {
            heading: "Ordering",
            body: [
              "Orders are placed via WhatsApp and our social channels. An order is confirmed once we've agreed the items, total and delivery details with you in writing.",
            ],
          },
          {
            heading: "Pricing & availability",
            body: [
              "All prices are listed in Pakistani Rupees (PKR). We do our best to keep listings accurate, but prices and availability can change, and pieces are subject to stock at the time you order.",
              "Product photos are styled to represent each piece as faithfully as possible; slight variation in colour or finish can occur.",
            ],
          },
          {
            heading: "Payment",
            body: [
              "Accepted payment methods are confirmed on WhatsApp at the time of ordering. Your order is dispatched once payment is confirmed, unless we've agreed otherwise.",
            ],
          },
          {
            heading: "Returns & shipping",
            body: [
              "Returns, exchanges and delivery are covered by our Returns and Shipping policies, which form part of these terms.",
            ],
          },
          {
            heading: "Contact",
            body: [
              `For anything at all, reach us on WhatsApp at ${site.whatsapp.display} or ${site.socials.instagram.handle}.`,
            ],
          },
        ]}
      />
    </main>
  );
}

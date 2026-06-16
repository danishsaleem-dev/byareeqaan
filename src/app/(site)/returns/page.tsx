import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns & exchanges — By Areeqaan",
  description: "By Areeqaan's returns and exchange policy for jewellery orders.",
};

export default function ReturnsPage() {
  return (
    <main>
      <LegalPage
        title="Returns & exchanges"
        intro="We want you to love your pieces. If something isn't quite right, here's how we'll make it right."
        updated="June 2026"
        sections={[
          {
            heading: "Exchanges",
            body: [
              "We're happy to exchange unworn pieces in their original condition and packaging within 7 days of delivery. Reach out on WhatsApp with your order details and we'll guide you through it.",
            ],
          },
          {
            heading: "Damaged or incorrect items",
            body: [
              "If your order arrives damaged or you received the wrong item, message us within 48 hours of delivery with a clear photo. We'll arrange a replacement or refund at no extra cost.",
            ],
          },
          {
            heading: "What can't be returned",
            body: [
              "For hygiene reasons, earrings, nails and any worn or customised pieces can't be returned or exchanged unless they arrived faulty.",
              "Sale and clearance items are final sale.",
            ],
          },
          {
            heading: "How returns work",
            body: [
              "Return shipping is arranged by the customer unless the item was faulty or incorrect. Once we receive and inspect the piece, your exchange or refund is processed promptly.",
            ],
          },
          {
            heading: "Start a return",
            body: [
              `Message us on WhatsApp at ${site.whatsapp.display} or DM ${site.socials.instagram.handle} with your order number and we'll take it from there.`,
            ],
          },
        ]}
      />
    </main>
  );
}

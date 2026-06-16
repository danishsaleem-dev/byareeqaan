import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { Guarantee } from "@/components/site/Guarantee";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description:
    "By Areeqaan offers a 100% money-back guarantee on damaged products. See how to claim your refund with an unboxing video.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <main>
      <div className="px-4 pt-32 sm:px-6 sm:pt-40">
        <Guarantee compact />
      </div>

      <LegalPage
        eyebrow="Returns & refunds"
        title="Refund policy"
        intro="We want you to love your pieces. Here's exactly how our 100% money-back guarantee works."
        updated="June 2026"
        sections={[
          {
            heading: "100% refund on damaged products",
            body: [
              "We carefully pack every order with love and care. But in the rare case your item arrives damaged, you're fully covered — we'll refund you 100%.",
              "To keep this fair and fast for everyone, a refund on a damaged item requires a clear unboxing video (details below).",
            ],
          },
          {
            heading: "How to claim a refund",
            body: [
              "Record a clear unboxing video while opening your parcel.",
              "The video must be continuous and unedited — no cuts or pauses.",
              "Show the package condition before you open it.",
              "Contact us immediately after receiving the parcel.",
            ],
          },
          {
            heading: "Exchanges",
            body: [
              "We're happy to exchange unworn pieces in their original condition and packaging within 7 days of delivery. Message us on WhatsApp with your order details and we'll guide you through it.",
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
            heading: "Start a refund or exchange",
            body: [
              `Message us on WhatsApp at ${site.whatsapp.display} or DM ${site.socials.instagram.handle} with your order number and your unboxing video, and we'll take it from there. Our goal is to make your shopping experience safe, easy and worry-free.`,
            ],
          },
        ]}
      />
    </main>
  );
}

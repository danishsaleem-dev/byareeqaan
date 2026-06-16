import type { Metadata } from "next";
import { Gift, Layers, MessageCircle, Sparkles, Truck } from "lucide-react";
import { promises } from "@/lib/site";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Why By Areeqaan",
  description:
    "Handpicked, trend-led jewellery, hand-wrapped orders and easy WhatsApp ordering — delivered across Pakistan and worldwide.",
};

const icons = [Sparkles, Truck, Layers, Gift];

const steps = [
  {
    n: "01",
    title: "Browse the edit",
    body: "Explore collections and find the pieces that feel like you.",
  },
  {
    n: "02",
    title: "Message us",
    body: "Tap “Order on WhatsApp” — we confirm availability and total in minutes.",
  },
  {
    n: "03",
    title: "Delivered to you",
    body: "Hand-wrapped and shipped across Pakistan and worldwide, tracked all the way.",
  },
];

export default function WhyUsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Why us"
        title={
          <>
            The little things,{" "}
            <span className="italic text-gradient">done beautifully</span>
          </>
        }
        subtitle="Minimal jewellery should feel personal. Here's what you get with every By Areeqaan order."
      />

      {/* values */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-6">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal
                key={p.title}
                i={i}
                className="group relative overflow-hidden rounded-[1.4rem] border border-plum/10 bg-cream/40 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet/30 hover:bg-ivory hover:shadow-soft"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-deep text-ivory transition-colors duration-500 group-hover:bg-violet">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-2xl font-medium text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                <span className="absolute right-5 top-6 font-display text-4xl text-violet/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
        <div className="mb-12 text-center">
          <Reveal className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
            <span className="h-px w-8 bg-violet" /> How ordering works
            <span className="h-px w-8 bg-violet" />
          </Reveal>
          <h2 className="font-display text-[clamp(1.9rem,5vw,3.2rem)] font-medium leading-[1.05] text-ink">
            Three steps to your{" "}
            <span className="italic text-gradient">new favourite</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal
              key={s.n}
              i={i}
              className="relative rounded-[1.4rem] border border-plum/10 bg-ivory p-8"
            >
              <span className="font-display text-5xl font-semibold text-violet/15">
                {s.n}
              </span>
              <h3 className="mt-3 flex items-center gap-2 font-display text-2xl font-medium text-ink">
                {i === 1 && <MessageCircle size={20} className="text-violet" />}
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials />
      <Contact />
    </main>
  );
}

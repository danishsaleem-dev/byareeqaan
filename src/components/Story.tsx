"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Leaf } from "./Leaf";
import { Reveal, RevealText } from "./Reveal";
import { SmartImage } from "./site/SmartImage";

type StoryData = { title?: string; content?: string; image?: string };

const DEFAULT_TITLE = "Small brand, big intentions.";
const DEFAULT_BODY = [
  "By Areeqaan began as a love letter to minimal, modern adornment — jewellery that feels personal, never loud. Each piece is chosen for its quiet confidence: clean lines, a little shine, and the kind of versatility that takes you from morning coffee to midnight.",
  "We're a growing label, and that's the magic — you get a close, personal experience, hand-wrapped orders, and styling help whenever you want it. Delivered with care across Pakistan and abroad.",
];

export function Story({ data }: { data?: StoryData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  const title = data?.title?.trim() || DEFAULT_TITLE;
  const words = title.split(" ");
  const lastWord = words.length > 1 ? words.pop()! : "";
  const lead = words.join(" ");
  const body =
    data?.content?.trim()
      ? data.content.split("\n").map((s) => s.trim()).filter(Boolean)
      : DEFAULT_BODY;
  const image = data?.image?.trim();

  return (
    <section id="story" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Visual */}
        <div ref={ref} className="relative order-2 lg:order-1">
          <motion.div
            style={{ rotate }}
            className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-deep via-violet to-violet-bright shadow-card"
          >
            {image ? (
              <SmartImage
                src={image}
                alt="By Areeqaan"
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                <Leaf className="absolute -left-4 top-6 h-2/3 w-auto text-white/20" />
                <Leaf flip className="absolute -right-4 bottom-6 h-2/3 w-auto text-white/20" />
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="By Areeqaan" className="h-auto w-full max-w-[70%] object-contain drop-shadow-[0_2px_20px_rgba(255,255,255,0.4)]" />
                </div>
              </>
            )}
          </motion.div>
          {/* floating chip */}
          <motion.div
            style={{ y }}
            className="absolute -bottom-6 -right-2 rounded-2xl bg-ivory/90 p-4 shadow-soft backdrop-blur sm:-right-8"
          >
            <p className="font-display text-3xl font-semibold text-violet-deep">
              100%
            </p>
            <p className="text-xs text-muted">handpicked pieces</p>
          </motion.div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
            <span className="h-px w-8 bg-violet" /> Our story
          </Reveal>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] text-ink">
            <RevealText text={lead} />{" "}
            {lastWord && (
              <RevealText text={lastWord} className="italic text-gradient" delay={0.1} />
            )}
          </h2>

          {body.map((para, i) => (
            <Reveal key={i} i={i + 1} as="p" className="mt-6 text-base leading-relaxed text-muted first:mt-6 [&:not(:first-of-type)]:mt-4">
              {para}
            </Reveal>
          ))}

          <Reveal i={body.length + 1} className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
            {[
              { k: "Nationwide", v: "Delivery in Pakistan" },
              { k: "Worldwide", v: "International shipping" },
              { k: "WhatsApp", v: "Order in minutes" },
            ].map((s) => (
              <div key={s.k}>
                <p className="font-display text-xl font-semibold text-violet-deep">
                  {s.k}
                </p>
                <p className="text-sm text-muted">{s.v}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

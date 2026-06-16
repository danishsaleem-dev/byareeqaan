"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Leaf } from "./Leaf";
import { Reveal, RevealText } from "./Reveal";

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section id="story" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Visual */}
        <div ref={ref} className="relative order-2 lg:order-1">
          <motion.div
            style={{ rotate }}
            className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-deep via-violet to-violet-bright shadow-card"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
            <Leaf className="absolute -left-4 top-6 h-2/3 w-auto text-white/20" />
            <Leaf flip className="absolute -right-4 bottom-6 h-2/3 w-auto text-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[34vw] font-semibold leading-none text-ivory/90 sm:text-[14rem]">
                BA
              </span>
            </div>
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
            <RevealText text="Small brand," />{" "}
            <RevealText text="big" className="italic text-gradient" />{" "}
            <RevealText text="intentions." delay={0.1} />
          </h2>

          <Reveal i={1} as="p" className="mt-6 text-base leading-relaxed text-muted">
            By Areeqaan began as a love letter to minimal, modern adornment —
            jewellery that feels personal, never loud. Each piece is chosen for
            its quiet confidence: clean lines, a little shine, and the kind of
            versatility that takes you from morning coffee to midnight.
          </Reveal>
          <Reveal i={2} as="p" className="mt-4 text-base leading-relaxed text-muted">
            We&apos;re a growing label, and that&apos;s the magic — you get a
            close, personal experience, hand-wrapped orders, and styling help
            whenever you want it. Delivered with care across Pakistan and abroad.
          </Reveal>

          <Reveal i={3} className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
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

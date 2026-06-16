"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { collections as fallbackCollections, site } from "@/lib/site";
import type { Collection } from "@/lib/types";
import { gradFor } from "@/lib/format";
import { Reveal, RevealText } from "./Reveal";
import { SmartImage } from "./site/SmartImage";

const ease = [0.16, 1, 0.3, 1] as const;

function waLinkFor(name: string) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(
    `Hi By Areeqaan! I'm interested in your ${name}. ✨`
  )}`;
}

export function Collections({ data }: { data?: Collection[] }) {
  const real = data && data.length > 0 ? data : null;

  return (
    <section id="collections" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
          <div>
            <Reveal className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
              <span className="h-px w-8 bg-violet" /> The collections
            </Reveal>
            <h2 className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-medium leading-[1] text-ink">
              <RevealText text="Find your everyday" />
              <br />
              <RevealText text="signature" className="italic text-gradient" />
            </h2>
          </div>
          <Reveal i={2} as="p" className="max-w-xs text-sm text-muted sm:text-right">
            {real
              ? "Explore the edits and tap a collection to see the pieces inside."
              : "Eight edits of minimal, modern jewellery. Tap any piece to start an order on WhatsApp."}
          </Reveal>
        </div>

        {real ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {real.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: (i % 4) * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  href={`/collections/${c.slug}`}
                  className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.4rem] p-5 text-ivory shadow-card"
                >
                  <SmartImage
                    src={c.imageUrl}
                    alt={c.name}
                    grad={gradFor(c.id)}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-deep/70 via-violet-deep/10 to-transparent" />
                  <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-display text-lg text-white/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-violet-deep">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-display text-2xl font-medium sm:text-3xl">
                      {c.name}
                    </h3>
                    {c.description && (
                      <p className="mt-1 max-h-0 overflow-hidden text-xs leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                        {c.description}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {fallbackCollections.map((c, i) => (
              <motion.a
                key={c.name}
                href={waLinkFor(c.name)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: (i % 4) * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.4rem] p-5 text-ivory shadow-card"
                style={{ background: `linear-gradient(155deg, ${c.from}, ${c.to})` }}
              >
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                <JewelMark className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-white/15 transition-transform duration-700 group-hover:rotate-45" />

                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-violet-deep">
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-medium sm:text-3xl">
                    {c.name}
                  </h3>
                  <p className="mt-1 max-h-0 overflow-hidden text-xs leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {c.blurb}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function JewelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" />
      <path d="M50 20 L58 36 L42 36 Z" fill="currentColor" opacity="0.6" />
      <path d="M50 6 V20 M50 80 V94 M6 50 H20 M80 50 H94" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

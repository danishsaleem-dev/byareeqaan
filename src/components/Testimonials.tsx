"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Quote, Play } from "lucide-react";
import { Reveal, RevealText } from "./Reveal";
import type { Testimonial } from "@/lib/testimonials";
import { WhatsAppIcon, InstagramIcon } from "@/components/BrandIcons";

const SOURCE_ICON: Record<string, React.ReactNode> = {
  whatsapp: <WhatsAppIcon size={13} />,
  instagram: <InstagramIcon size={13} />,
  video: <Play size={11} fill="currentColor" />,
  text: <Quote size={11} />,
};

const SOURCE_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  video: "Video",
  text: "Review",
};

const SOURCE_BADGE: Record<string, string> = {
  whatsapp: "bg-emerald-500/15 text-emerald-700",
  instagram: "bg-pink-500/15 text-pink-700",
  video: "bg-violet/15 text-violet-deep",
  text: "bg-plum/10 text-plum",
};

function TestimonialCard({ t, i }: { t: Testimonial; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [i % 2 === 0 ? 30 : -30, i % 2 === 0 ? -30 : 30]);

  const hasMedia = !!t.mediaUrl;
  const isVideo = t.mediaType === "video";

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-plum/10 bg-white shadow-[0_4px_24px_-8px_rgba(76,29,149,0.10)] transition-shadow hover:shadow-[0_8px_32px_-8px_rgba(76,29,149,0.18)]"
    >
      {/* Media */}
      {hasMedia && (
        <div className="relative overflow-hidden bg-cream">
          {isVideo ? (
            <video
              src={t.mediaUrl}
              controls
              className="w-full max-h-64 object-cover"
              preload="metadata"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.mediaUrl}
              alt={`Review by ${t.authorName}`}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ maxHeight: 260 }}
            />
          )}
          {/* source badge overlay */}
          <span
            className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${SOURCE_BADGE[t.sourceType]} bg-white/70`}
          >
            {SOURCE_ICON[t.sourceType]}
            {SOURCE_LABEL[t.sourceType]}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {!hasMedia && (
          <span
            className={`mb-3 inline-flex items-center gap-1 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold ${SOURCE_BADGE[t.sourceType]}`}
          >
            {SOURCE_ICON[t.sourceType]}
            {SOURCE_LABEL[t.sourceType]}
          </span>
        )}

        {t.content && (
          <div className="flex-1">
            {!hasMedia && <Quote size={22} className="mb-3 text-violet/30" />}
            <p className="font-display text-[1.05rem] leading-snug text-plum">
              &ldquo;{t.content}&rdquo;
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-plum/8 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-deep to-violet-bright font-display text-base font-semibold text-ivory">
            {t.authorName[0].toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{t.authorName}</p>
            {t.authorHandle && (
              <p className="text-xs text-muted">{t.authorHandle}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory via-cream/40 to-ivory" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
            <span className="h-px w-8 bg-violet" /> From our customers
          </Reveal>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] text-ink">
            <RevealText text="Loved by" />{" "}
            <RevealText text="the muses" className="italic text-gradient" delay={0.05} />
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((t, i) => (
            <div key={t.id} className="mb-5 break-inside-avoid">
              <TestimonialCard t={t} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

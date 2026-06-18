"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Play, Maximize2, X, Heart } from "lucide-react";
import { Reveal, RevealText } from "./Reveal";
import type { Testimonial } from "@/lib/testimonials";
import { WhatsAppIcon, InstagramIcon } from "@/components/BrandIcons";

const ease = [0.16, 1, 0.3, 1] as const;

const SOURCE_ICON: Record<string, React.ReactNode> = {
  whatsapp: <WhatsAppIcon size={12} />,
  instagram: <InstagramIcon size={12} />,
  video: <Play size={10} fill="currentColor" />,
  text: <Quote size={10} />,
};

const SOURCE_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  video: "Video",
  text: "Review",
};

const SOURCE_CHIP: Record<string, string> = {
  whatsapp: "bg-emerald-500 text-white",
  instagram: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
  video: "bg-violet-deep text-white",
  text: "bg-plum text-ivory",
};

// Small deterministic tilt so the grid feels like a pinned "wall of love".
const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.3, 0.9];

type LightboxItem = { t: Testimonial } | null;

function SourceChip({ source }: { source: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm ${SOURCE_CHIP[source]}`}
    >
      {SOURCE_ICON[source]}
      {SOURCE_LABEL[source]}
    </span>
  );
}

function MediaCard({
  t,
  onOpen,
}: {
  t: Testimonial;
  onOpen: () => void;
}) {
  const isVideo = t.mediaType === "video";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-[1.3rem] border border-plum/10 bg-white text-left shadow-[0_4px_24px_-10px_rgba(76,29,149,0.18)] transition-all duration-500 hover:shadow-[0_14px_40px_-12px_rgba(76,29,149,0.3)]"
    >
      <div className="relative overflow-hidden bg-cream">
        {isVideo ? (
          <>
            <video
              src={t.mediaUrl}
              className="w-full object-cover"
              style={{ maxHeight: 420 }}
              muted
              playsInline
              preload="metadata"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-violet-deep shadow-lg transition-transform duration-500 group-hover:scale-110">
                <Play size={22} fill="currentColor" className="ml-0.5" />
              </span>
            </span>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.mediaUrl}
            alt={`Review from ${t.authorName || SOURCE_LABEL[t.sourceType]}`}
            loading="lazy"
            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ maxHeight: 420 }}
          />
        )}

        {/* source chip */}
        <span className="absolute left-3 top-3">
          <SourceChip source={t.sourceType} />
        </span>

        {/* read-more affordance for screenshots */}
        {!isVideo && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 size={11} /> Tap to read
          </span>
        )}
        {/* fade so a long screenshot hints there's more */}
        {!isVideo && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
        )}
      </div>

      {/* optional caption under media — no avatar/city block for screenshots */}
      {t.content && (
        <p className="px-4 py-3 text-sm leading-snug text-plum/80">
          &ldquo;{t.content}&rdquo;
          {t.authorName && (
            <span className="mt-1 block text-xs font-medium text-muted">
              — {t.authorName}
              {t.authorHandle ? `, ${t.authorHandle}` : ""}
            </span>
          )}
        </p>
      )}
    </button>
  );
}

function TextCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[1.3rem] border border-plum/10 bg-gradient-to-br from-white to-cream/50 p-6 shadow-[0_4px_24px_-12px_rgba(76,29,149,0.14)]">
      <Quote size={26} className="mb-3 text-violet/30" />
      <p className="flex-1 font-display text-[1.15rem] leading-snug text-plum">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-plum/8 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-deep to-violet-bright font-display text-base font-semibold text-ivory">
          {(t.authorName || "♡")[0].toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{t.authorName}</p>
          {t.authorHandle && (
            <p className="truncate text-xs text-muted">{t.authorHandle}</p>
          )}
        </div>
        <span className="ml-auto">
          <SourceChip source={t.sourceType} />
        </span>
      </div>
    </div>
  );
}

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const t = item?.t;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!t) return;
    window.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [t, handleKey]);

  return (
    <AnimatePresence>
      {t && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md sm:p-8"
        >
          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-plum/10 px-4 py-3">
              <SourceChip source={t.sourceType} />
              {t.authorName && (
                <span className="truncate text-sm font-medium text-ink">
                  {t.authorName}
                  {t.authorHandle && (
                    <span className="ml-1 font-normal text-muted">{t.authorHandle}</span>
                  )}
                </span>
              )}
            </div>

            {/* media — scrollable for tall screenshots */}
            <div className="min-h-0 flex-1 overflow-auto bg-cream/40">
              {t.mediaType === "video" ? (
                <video
                  src={t.mediaUrl}
                  controls
                  autoPlay
                  className="w-full"
                  style={{ maxHeight: "75vh" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.mediaUrl} alt="" className="w-full" />
              )}
            </div>

            {t.content && (
              <p className="border-t border-plum/10 px-4 py-3 text-sm leading-snug text-plum/85">
                &ldquo;{t.content}&rdquo;
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [lightbox, setLightbox] = useState<LightboxItem>(null);

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory via-cream/30 to-ivory" />
      <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
            <Heart size={12} className="fill-violet text-violet" /> Wall of love
          </Reveal>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] text-ink">
            <RevealText text="Real words from" />{" "}
            <RevealText text="real muses" className="italic text-gradient" delay={0.05} />
          </h2>
          <Reveal
            as="p"
            i={1}
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted"
          >
            Straight from our DMs, WhatsApp chats and Instagram stories — tap any
            screenshot to read the whole thing.
          </Reveal>
        </div>

        {/* masonry wall */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((t, i) => {
            const isText = t.sourceType === "text" || (!t.mediaUrl && !!t.content);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 26, rotate: TILTS[i % TILTS.length] }}
                whileInView={{ opacity: 1, y: 0, rotate: TILTS[i % TILTS.length] }}
                whileHover={{ rotate: 0, y: -4 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease }}
                className="mb-5 break-inside-avoid"
              >
                {isText ? (
                  <TextCard t={t} />
                ) : (
                  <MediaCard t={t} onOpen={() => setLightbox({ t })} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}

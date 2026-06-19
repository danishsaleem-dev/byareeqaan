"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";
import type { ProductImage } from "@/lib/types";
import { SmartImage } from "./SmartImage";

type Media = { kind: "image"; url: string } | { kind: "video"; url: string };

const ease = [0.16, 1, 0.3, 1] as const;

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  media,
  index,
  onClose,
  onPrev,
  onNext,
  onJump,
}: {
  media: Media[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}) {
  const current = media[index];
  const total = media.length;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/92 backdrop-blur-md"
    >
      {/* close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* counter */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
        {index + 1} / {total}
      </div>

      {/* main image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[75vh] max-w-[90vw] items-center justify-center sm:max-h-[80vh] sm:max-w-[80vw]"
      >
        {current.kind === "video" ? (
          <video
            src={current.url}
            controls
            autoPlay
            className="max-h-[75vh] max-w-full rounded-2xl object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt=""
            className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        )}
      </motion.div>

      {/* nav arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-6"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-6"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* thumbnail strip */}
      {total > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-2xl bg-black/40 p-2 backdrop-blur"
        >
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); onJump(i); }}
              className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                i === index
                  ? "ring-2 ring-white ring-offset-1 ring-offset-black/50"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              {m.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-white/20 text-white">
                  <Play size={14} fill="currentColor" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── ProductGallery ────────────────────────────────────────────────────────────
export function ProductGallery({
  images,
  videos,
  name,
  grad,
}: {
  images: ProductImage[];
  videos: string[];
  name: string;
  grad: string;
}) {
  const ordered = [...images].sort(
    (a, b) => Number(!!b.primary) - Number(!!a.primary),
  );
  const media: Media[] = [
    ...ordered.map((i) => ({ kind: "image" as const, url: i.url })),
    ...videos.map((v) => ({ kind: "video" as const, url: v })),
  ];

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const current = media[active];

  const openLightbox = () => {
    if (current?.kind === "image") setLightboxOpen(true);
  };

  const prev = useCallback(
    () => setActive((i) => (i - 1 + media.length) % media.length),
    [media.length],
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % media.length),
    [media.length],
  );

  return (
    <div className="lg:sticky lg:top-28">
      {/* Main image */}
      <div
        className={`group relative aspect-[4/5] overflow-hidden rounded-[1.8rem] shadow-card ${
          current?.kind === "image" ? "cursor-zoom-in" : ""
        }`}
        onClick={openLightbox}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-0"
          >
            {!current || current.kind === "image" ? (
              <SmartImage
                src={current?.url}
                alt={name}
                grad={grad}
                priority={active === 0}
                eager
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-full w-full"
              />
            ) : (
              <video
                src={current.url}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* zoom hint for images */}
        {current?.kind === "image" && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn size={12} /> View full
          </span>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] ring-1 ring-inset ring-white/10" />
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View ${i + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-xl transition-all duration-300 sm:h-20 sm:w-20 ${
                i === active
                  ? "ring-2 ring-violet-deep ring-offset-2 ring-offset-ivory"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {m.kind === "image" ? (
                <SmartImage
                  src={m.url}
                  alt={`${name} ${i + 1}`}
                  grad={grad}
                  sizes="80px"
                  className="h-full w-full"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-plum/80 text-ivory">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            media={media}
            index={active}
            onClose={() => setLightboxOpen(false)}
            onPrev={prev}
            onNext={next}
            onJump={setActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

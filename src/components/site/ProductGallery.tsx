"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ProductImage } from "@/lib/types";
import { SmartImage } from "./SmartImage";

type Media =
  | { kind: "image"; url: string }
  | { kind: "video"; url: string };

const ease = [0.16, 1, 0.3, 1] as const;

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
  const current = media[active];

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] shadow-card">
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
                eager
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
        <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] ring-1 ring-inset ring-white/10" />
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View ${i + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-xl transition-all duration-300 sm:h-20 sm:w-20 ${
                i === active
                  ? "ring-2 ring-violet-deep ring-offset-2 ring-offset-ivory"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {m.kind === "image" ? (
                <SmartImage src={m.url} alt={`${name} ${i + 1}`} grad={grad} className="h-full w-full" />
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
    </div>
  );
}

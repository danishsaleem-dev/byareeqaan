"use client";

import { useState } from "react";
import Image from "next/image";
import { gradFor } from "@/lib/format";
import { isOptimizable } from "@/lib/image";

/**
 * An image with a guaranteed on-brand backdrop. Known hosts (Supabase, Unsplash)
 * go through the Next.js optimizer (AVIF/WebP, responsive srcset); unknown hosts
 * render as a plain <img>; a missing/failed src shows the gradient + jewel glyph.
 *
 * `eager`    — load immediately (above-the-fold).
 * `priority` — also preload (use only for the page's LCP image).
 */
export function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  grad,
  eager = false,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  grad?: string;
  eager?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const [err, setErr] = useState(false);
  const show = src && !err;

  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: grad ?? gradFor(alt) }}
    >
      {show ? (
        isOptimizable(src) ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={eager || priority ? "eager" : "lazy"}
            preload={priority}
            draggable={false}
            onError={() => setErr(true)}
            className={`object-cover ${imgClassName}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading={eager || priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onError={() => setErr(true)}
            className={`h-full w-full object-cover ${imgClassName}`}
          />
        )
      ) : (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-1/3 w-1/3 text-white/25" fill="none" aria-hidden>
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" />
            <path d="M50 20 L58 36 L42 36 Z" fill="currentColor" opacity="0.6" />
            <path d="M50 6 V20 M50 80 V94 M6 50 H20 M80 50 H94" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      )}
    </span>
  );
}

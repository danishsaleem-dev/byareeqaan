"use client";

import { useState } from "react";
import { gradFor } from "@/lib/format";

/**
 * An <img> with a guaranteed on-brand backdrop. If `src` is missing or fails to
 * load, the gradient + jewel glyph shows instead — never a broken image.
 */
export function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  grad,
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  grad?: string;
  eager?: boolean;
}) {
  const [err, setErr] = useState(false);
  const show = src && !err;
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: grad ?? gradFor(alt) }}
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onError={() => setErr(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
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

"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf } from "./Leaf";

/** Brand purple, matched to the BA · By Areeqaan artwork. */
const PURPLE = "#7a1fa2";

/**
 * Renders the real logo artwork from `/public/logo.png`. If that file is ever
 * missing it falls back to an on-brand vector recreation, so the brand mark
 * always shows.
 *
 * `className`        — sizes the real image (height-based, e.g. "h-12 w-auto").
 * `fallbackClassName`— font-size for the vector fallback (em-scaled).
 * `stacked`          — fallback layout: emblem (footer) vs inline (navbar).
 */
export function Logo({
  className = "h-11 w-auto",
  fallbackClassName = "text-[19px]",
  stacked = false,
  priority = false,
}: {
  className?: string;
  fallbackClassName?: string;
  stacked?: boolean;
  priority?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  // The error event can fire before hydration (and be missed by React), so we
  // also re-check after mount: a complete image with zero width means it 404'd.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setUseFallback(true);
  }, []);

  if (!useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src="/logo.png"
        alt="By Areeqaan"
        width={600}
        height={534}
        className={`${className} select-none`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
        onError={() => setUseFallback(true)}
      />
    );
  }

  return <LogoFallback className={fallbackClassName} stacked={stacked} />;
}

/** Vector recreation used only if the artwork file is unavailable. */
function LogoFallback({
  className = "",
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  return (
    <span
      className={`inline-flex leading-none ${
        stacked ? "flex-col items-center gap-2" : "items-center gap-3"
      } ${className}`}
      style={{ color: PURPLE }}
      aria-label="By Areeqaan"
    >
      <span className="relative inline-flex items-center justify-center px-[0.55em]">
        <Leaf className="absolute right-[72%] top-[-22%] h-[1.85em] w-auto opacity-55" />
        <span className="font-display text-[2.1em] font-bold tracking-[-0.04em]">
          BA
        </span>
        <Leaf
          flip
          className="absolute left-[72%] top-[-6%] h-[2.05em] w-auto opacity-55"
        />
      </span>
      <span
        className={`font-display font-medium uppercase ${
          stacked
            ? "text-[0.6em] tracking-[0.42em]"
            : "text-[0.58em] tracking-[0.3em]"
        }`}
      >
        By&nbsp;Areeqaan
      </span>
    </span>
  );
}

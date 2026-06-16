"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "./BrandIcons";
import { site } from "@/lib/site";

const igLink = site.socials.instagram.url;
const ease = [0.16, 1, 0.3, 1] as const;

/** Tiny gradient swatches that read as an active, vibrant IG feed. */
const feedThumbs = [
  "linear-gradient(135deg,#6d28d9,#a78bfa)",
  "linear-gradient(135deg,#7c3aed,#c4b5fd)",
  "linear-gradient(135deg,#5b21b6,#c0a06a)",
];
const igGradient =
  "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)";

/**
 * Follow invite styled as a social-proof capsule: a cluster of "feed"
 * thumbnails + the recognizable Instagram-gradient glyph encourages follows
 * far better than a plain link. Pass `className` to control margin/alignment.
 */
export function InstagramInvite({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.a
      href={igLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay }}
      whileHover={{ y: -3 }}
      aria-label="Follow By Areeqaan on Instagram"
      className={`group flex w-fit max-w-full items-center gap-3 rounded-full border border-violet/15 bg-ivory/70 py-1.5 pl-2 pr-2 shadow-[0_14px_40px_-26px_rgba(76,29,149,0.6)] backdrop-blur transition-colors duration-300 hover:border-violet/35 ${className}`}
    >
      {/* feed thumbnails + IG glyph */}
      <span className="flex items-center -space-x-3">
        {feedThumbs.map((bg, i) => (
          <span
            key={i}
            className="h-9 w-9 rounded-full ring-2 ring-ivory transition-transform duration-300 group-hover:-translate-y-0.5"
            style={{ background: bg, transitionDelay: `${i * 40}ms` }}
          />
        ))}
        <span
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-white ring-2 ring-ivory"
          style={{ background: igGradient }}
        >
          <InstagramIcon size={17} />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full ring-2 ring-[#d62976]"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.45 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        </span>
      </span>

      <span className="pl-1 text-left leading-tight">
        <span className="block text-[13px] font-semibold text-plum">
          Follow @byareeqaan
        </span>
        <span className="hidden text-[11px] text-muted sm:block">
          New drops &amp; styling — daily on Instagram
        </span>
      </span>

      <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-violet-deep px-4 py-2 text-xs font-semibold text-ivory transition-colors duration-300 group-hover:bg-violet">
        Follow
        <ArrowUpRight
          size={14}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </motion.a>
  );
}

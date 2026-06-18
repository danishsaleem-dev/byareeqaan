"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Leaf } from "./Leaf";
import { InstagramInvite } from "./InstagramInvite";
import { site } from "@/lib/site";
import { gradFor } from "@/lib/format";
import { isOptimizable } from "@/lib/image";

const waLink = `https://wa.me/${site.whatsapp.number}`;
const ease = [0.16, 1, 0.3, 1] as const;

type Shot = { src: string; label: string; grad: string };

/**
 * Stock jewellery imagery (Unsplash) purely to preview the look when no real
 * photos exist yet. A gradient sits behind every tile, so a failed image still
 * renders as an on-brand placeholder. Real images are passed via `images`.
 */
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=80`;

const fallbackGallery: Shot[] = [
  { src: U("1515562141207-7a88fb7ce338"), label: "Earrings", grad: "linear-gradient(135deg,#6d28d9,#a78bfa)" },
  { src: U("1611591437281-460bfbe1220a"), label: "Rings", grad: "linear-gradient(135deg,#4c1d95,#8b5cf6)" },
  { src: U("1599643478518-a784e5dc4c8f"), label: "Necklaces", grad: "linear-gradient(135deg,#7c3aed,#c4b5fd)" },
  { src: U("1535632066927-ab7c9ab60908"), label: "Studs", grad: "linear-gradient(135deg,#5b21b6,#a855f7)" },
  { src: U("1605100804763-247f67b3557e"), label: "Gold", grad: "linear-gradient(135deg,#6d28d9,#c0a06a)" },
  { src: U("1573408301185-9146fe634ad0"), label: "Layered", grad: "linear-gradient(135deg,#4338ca,#8b5cf6)" },
  { src: U("1602173574767-37ac01994b2a"), label: "Bands", grad: "linear-gradient(135deg,#7e22ce,#e9d5ff)" },
  { src: U("1611652022419-a9419f74343d"), label: "Chains", grad: "linear-gradient(135deg,#5b21b6,#c084fc)" },
];

function Tile({
  item,
  className = "",
  eager = false,
}: {
  item: Shot;
  className?: string;
  eager?: boolean;
}) {
  const [err, setErr] = useState(false);
  const alt = item.label ? `By Areeqaan ${item.label}` : "By Areeqaan";
  const imgClass =
    "h-full w-full object-cover transition-transform duration-700 hover:scale-105";
  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] shadow-card ${className}`}
      style={{ background: item.grad }}
    >
      {!err &&
        (isOptimizable(item.src) ? (
          <Image
            src={item.src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 25vw, 144px"
            loading={eager ? "eager" : "lazy"}
            draggable={false}
            onError={() => setErr(true)}
            className={imgClass}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onError={() => setErr(true)}
            className={imgClass}
          />
        ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-deep/45 via-transparent to-transparent" />
      {item.label && (
        <span className="pointer-events-none absolute bottom-3 left-3 font-display text-lg text-white drop-shadow">
          {item.label}
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-white/15" />
    </div>
  );
}

function VerticalColumn({
  items,
  direction,
  duration,
}: {
  items: Shot[];
  direction: "up" | "down";
  duration: number;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`absolute inset-x-0 top-0 flex flex-col gap-4 ${
        direction === "up" ? "animate-marquee-up" : "animate-marquee-down"
      }`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {row.map((item, i) => (
        <Tile key={i} item={item} eager className="aspect-[4/5] w-full" />
      ))}
    </div>
  );
}

type HeroConfig = {
  headline?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
};

export function HeroImage({
  hero,
  images,
}: {
  hero?: HeroConfig;
  images?: { src: string; label?: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const yGallery = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const gallery: Shot[] =
    images && images.length
      ? images.map((im) => ({
          src: im.src,
          label: im.label ?? "",
          grad: gradFor(im.src),
        }))
      : fallbackGallery;
  const half = Math.ceil(gallery.length / 2);
  const colA = gallery.slice(0, half);
  const colB = gallery.slice(half).length ? gallery.slice(half) : colA;

  const headline = hero?.headline?.trim() || "Tiny details. Big statements.";
  const tagline = hero?.tagline?.trim() || "Trendy · Minimal · Affordable Luxe";
  const ctaText = hero?.ctaText?.trim() || "Shop the edit";
  const ctaLink = hero?.ctaLink?.trim() || "/shop";
  const ctaExternal = /^https?:\/\//.test(ctaLink);

  // Split the headline into lines on sentence boundaries; italicise the last
  // word of the final line for the brand's signature accent.
  const lines = headline.split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean);
  const headlineLines = lines.length ? lines : [headline];

  const ctaInner = (
    <>
      {ctaText}
      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </>
  );
  const ctaClass =
    "group inline-flex items-center gap-2 rounded-full bg-violet-deep px-7 py-3.5 text-sm font-medium text-ivory shadow-soft transition-all duration-300 hover:bg-violet hover:shadow-[0_20px_45px_-18px_rgba(109,40,217,0.75)]";

  return (
    <section id="top" ref={ref} className="relative overflow-hidden lg:min-h-[100svh]">
      {/* ambient field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.32),transparent_65%)] blur-2xl" />
        <div className="absolute bottom-[-15%] right-[20%] h-[45vh] w-[45vh] rounded-full bg-[radial-gradient(circle,rgba(192,160,106,0.25),transparent_65%)] blur-2xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* ---------- Content ---------- */}
        <motion.div
          style={{ y: yContent, opacity }}
          className="relative z-10 min-w-0 pt-32 text-center lg:py-24 lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet/20 bg-ivory/60 px-4 py-1.5 text-xs font-medium uppercase tracking-luxe text-violet-deep backdrop-blur"
          >
            <Sparkles size={13} /> Fashion Accessories
          </motion.span>

          <h1 className="mt-6 font-display text-[clamp(2.8rem,7.5vw,6rem)] font-medium leading-[0.95] text-ink">
            {headlineLines.map((line, idx) => {
              const isLast = idx === headlineLines.length - 1;
              const words = line.split(" ");
              const last = words.pop() ?? line;
              const lead = words.join(" ");
              return (
                <Line key={idx} delay={0.4 + idx * 0.12}>
                  {lead ? `${lead} ` : ""}
                  {isLast ? (
                    <span className="italic text-gradient">{last}</span>
                  ) : (
                    last
                  )}
                </Line>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="mx-auto mt-6 max-w-md text-base font-medium tracking-wide text-muted sm:text-lg lg:mx-0"
          >
            {tagline}
          </motion.p>

          {/* mobile gallery (horizontal) */}
          <div className="relative mt-9 -mx-6 overflow-hidden lg:hidden">
            <div className="flex w-max animate-marquee gap-3 px-6 [--marquee-duration:16s]">
              {[...gallery, ...gallery].map((item, i) => (
                <Tile key={i} item={item} className="aspect-[4/5] w-36 shrink-0" />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ivory to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ivory to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.05 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            {ctaExternal ? (
              <a href={ctaLink} target="_blank" rel="noopener noreferrer" className={ctaClass}>
                {ctaInner}
              </a>
            ) : (
              <Link href={ctaLink} className={ctaClass}>
                {ctaInner}
              </Link>
            )}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-plum/20 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:border-violet hover:text-violet-deep"
            >
              Message us
            </a>
          </motion.div>

          <InstagramInvite delay={1.25} className="mx-auto mt-7 lg:mx-0" />
        </motion.div>

        {/* ---------- Gallery (desktop) ---------- */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          style={{ y: yGallery }}
          className="relative hidden h-[100svh] overflow-hidden lg:block"
        >
          <Leaf className="absolute -left-6 top-1/4 z-10 h-40 w-auto text-violet/20" />
          <div className="absolute inset-0 grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden">
              <VerticalColumn items={colA} direction="up" duration={18} />
            </div>
            <div className="relative overflow-hidden">
              <VerticalColumn items={colB} direction="down" duration={18} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivory to-transparent" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="text-[10px] uppercase tracking-luxe">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-violet to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

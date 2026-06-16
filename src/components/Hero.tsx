"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Leaf } from "./Leaf";
import { InstagramInvite } from "./InstagramInvite";
import { site } from "@/lib/site";

const waLink = `https://wa.me/${site.whatsapp.number}`;
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Ambient gradient field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.35),transparent_65%)] blur-2xl" />
        <div className="absolute bottom-[-15%] left-[5%] h-[45vh] w-[45vh] rounded-full bg-[radial-gradient(circle,rgba(192,160,106,0.28),transparent_65%)] blur-2xl" />
        <div className="absolute right-[2%] top-[20%] h-[40vh] w-[40vh] rounded-full bg-[radial-gradient(circle,rgba(76,29,149,0.25),transparent_65%)] blur-2xl" />
      </div>

      {/* Slowly rotating ring motif */}
      <motion.div
        style={{ scale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[88vmin] w-[88vmin] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="animate-spin-slow h-full w-full rounded-full border border-violet/15" />
        <div className="absolute inset-[8%] rounded-full border border-gold/20" />
      </motion.div>

      {/* Floating botanical sprigs */}
      <Leaf className="animate-float absolute left-[6%] top-[18%] hidden h-40 w-auto text-violet/25 md:block" />
      <Leaf
        flip
        className="animate-float absolute right-[6%] bottom-[14%] hidden h-48 w-auto text-violet/25 md:block"
        // slightly different rhythm
        style={{ animationDelay: "1.5s" }}
      />

      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet/20 bg-ivory/60 px-4 py-1.5 text-xs font-medium uppercase tracking-luxe text-violet-deep backdrop-blur"
        >
          <Sparkles size={13} /> Handpicked · Pakistan & worldwide
        </motion.span>

        <h1 className="mt-7 font-display text-[clamp(2.8rem,9vw,7rem)] font-medium leading-[0.95] text-ink">
          <Line delay={0.4}>Tiny details.</Line>
          <Line delay={0.52}>
            Big <span className="italic text-gradient">statements.</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.9 }}
          className="mx-auto mt-7 max-w-xl text-base font-medium tracking-wide text-muted sm:text-lg"
        >
          Trendy <span className="text-violet/50">·</span> Minimal{" "}
          <span className="text-violet/50">·</span> Affordable Luxe
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 1.05 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#collections"
            className="group inline-flex items-center gap-2 rounded-full bg-violet-deep px-7 py-3.5 text-sm font-medium text-ivory shadow-soft transition-all duration-300 hover:bg-violet hover:shadow-[0_20px_45px_-18px_rgba(109,40,217,0.75)]"
          >
            Explore collections
            <ArrowDown
              size={16}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-plum/20 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:border-violet hover:text-violet-deep"
          >
            Message us
          </a>
        </motion.div>

        <InstagramInvite delay={1.25} className="mx-auto mt-7" />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
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

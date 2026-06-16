"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Leaf } from "@/components/Leaf";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Animated header band for inner pages. Clears the fixed navbar and sets an
 * editorial, on-brand tone consistent with the homepage hero.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden px-5 pb-10 pt-32 text-center sm:px-6 sm:pb-14 sm:pt-40">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[42vh] w-[42vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_65%)] blur-2xl" />
      </div>
      <Leaf className="pointer-events-none absolute -left-2 top-24 hidden h-44 w-auto text-violet/15 sm:block" />
      <Leaf flip className="pointer-events-none absolute -right-2 top-28 hidden h-44 w-auto text-violet/15 sm:block" />

      <div className="mx-auto max-w-3xl">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet"
          >
            <span className="h-px w-8 bg-violet" /> {eyebrow}{" "}
            <span className="h-px w-8 bg-violet" />
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.06 }}
          className="font-display text-[clamp(2.4rem,7vw,4.8rem)] font-medium leading-[1] text-ink"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.26 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}

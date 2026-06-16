"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Story", href: "/story" },
  { label: "Why us", href: "/why-us" },
  { label: "Contact", href: "/contact" },
];

const waLink = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(
  "Hi By Areeqaan! I'd love to know more about your pieces ✨"
)}`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "bg-ivory/80 shadow-[0_10px_40px_-20px_rgba(36,22,39,0.5)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <Link href="/" aria-label="By Areeqaan — home" className="shrink-0">
          <Logo className="h-14 w-auto sm:h-16" fallbackClassName="text-[22px]" priority />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group relative text-sm font-medium text-plum/80 transition-colors hover:text-violet-deep"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-violet transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-violet-deep px-5 py-2.5 text-sm font-medium text-ivory shadow-soft transition-all duration-300 hover:bg-violet hover:shadow-[0_18px_40px_-18px_rgba(109,40,217,0.7)] sm:inline-flex"
          >
            Order on WhatsApp
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream text-plum md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl bg-ivory/95 p-4 shadow-card backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 font-display text-2xl text-plum transition-colors hover:bg-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block rounded-full bg-violet-deep px-5 py-3 text-center text-sm font-medium text-ivory"
            >
              Order on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

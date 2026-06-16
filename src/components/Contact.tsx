"use client";

import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { Leaf } from "./Leaf";
import { Reveal, RevealText } from "./Reveal";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "./BrandIcons";

const waLink = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(
  "Hi By Areeqaan! I'd like to place an order ✨"
)}`;

const channels = [
  {
    label: "WhatsApp",
    value: site.whatsapp.display,
    href: waLink,
    Icon: WhatsAppIcon,
  },
  {
    label: "Instagram",
    value: site.socials.instagram.handle,
    href: site.socials.instagram.url,
    Icon: InstagramIcon,
  },
  {
    label: "TikTok",
    value: site.socials.tiktok.handle,
    href: site.socials.tiktok.url,
    Icon: TikTokIcon,
  },
  {
    label: "Facebook",
    value: site.socials.facebook.handle,
    href: site.socials.facebook.url,
    Icon: FacebookIcon,
  },
];

export function Contact() {
  return (
    <section id="contact" className="px-4 pb-10 pt-12 sm:px-6 sm:pb-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-violet-deep px-6 py-16 text-ivory sm:rounded-[2.5rem] sm:px-12 sm:py-24">
        {/* ambient + botanicals */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-violet-bright/40 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        </div>
        <Leaf className="pointer-events-none absolute -bottom-8 left-6 h-64 w-auto text-white/10" />
        <Leaf flip className="pointer-events-none absolute -top-8 right-6 h-64 w-auto text-white/10" />

        <div className="relative z-10 text-center">
          <Reveal className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-luxe text-ivory/80">
            <MapPin size={13} /> Pakistan & worldwide
          </Reveal>

          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[0.98]">
            <RevealText text="Let's find your" />{" "}
            <span className="italic text-gold-soft">
              <RevealText text="next favourite" delay={0.1} />
            </span>
          </h2>

          <Reveal i={1} as="p" className="mx-auto mt-6 max-w-xl text-ivory/75">
            Message us on WhatsApp or slide into the DMs — we&apos;ll help you
            pick, style and ship anywhere you are.
          </Reveal>

          <Reveal i={2} className="mt-9 flex justify-center">
            <motion.a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-ivory px-8 py-4 text-base font-medium text-violet-deep shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
            >
              <WhatsAppIcon size={20} /> Chat on WhatsApp
            </motion.a>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-2">
            {channels.map((c, i) => (
              <Reveal key={c.label} i={i}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 text-ivory">
                      <c.Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-ivory/50">
                        {c.label}
                      </span>
                      <span className="block text-sm font-medium">{c.value}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ivory/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

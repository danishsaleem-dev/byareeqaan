"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/lib/site";
import { Reveal, RevealText } from "./Reveal";

export function Testimonials() {
  return (
    <section className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 text-center font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] text-ink">
          <RevealText text="Loved by" />{" "}
          <RevealText text="the muses" className="italic text-gradient" />
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              i={i}
              className="flex flex-col rounded-[1.4rem] border border-plum/10 bg-cream/40 p-8"
            >
              <Quote className="mb-5 text-violet/40" size={28} />
              <p className="font-display text-xl leading-snug text-plum">
                “{t.quote}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-deep font-display text-lg text-ivory">
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.city}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

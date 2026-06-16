"use client";

import { Gift, Layers, Sparkles, Truck } from "lucide-react";
import { promises } from "@/lib/site";
import { Reveal, RevealText } from "./Reveal";

const icons = [Sparkles, Truck, Layers, Gift];

export function Promise() {
  return (
    <section id="promise" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Reveal className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxe text-violet">
            <span className="h-px w-8 bg-violet" /> Why By Areeqaan
            <span className="h-px w-8 bg-violet" />
          </Reveal>
          <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.05] text-ink">
            <RevealText text="The little things," />{" "}
            <RevealText text="done beautifully" className="italic text-gradient" />
          </h2>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => {
            const Icon = icons[i];
            return (
              <Reveal
                key={p.title}
                i={i}
                className="group relative overflow-hidden rounded-[1.4rem] border border-plum/10 bg-cream/40 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet/30 hover:bg-ivory hover:shadow-soft"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-deep text-ivory transition-colors duration-500 group-hover:bg-violet">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-2xl font-medium text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
                <span className="absolute right-5 top-6 font-display text-4xl text-violet/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

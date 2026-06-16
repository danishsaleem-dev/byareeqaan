import Link from "next/link";
import { ShieldCheck, Video, PackageOpen, Scissors, MessageCircle } from "lucide-react";
import { guarantee } from "@/lib/site";
import { Leaf } from "@/components/Leaf";
import { Reveal } from "@/components/Reveal";

const icons = [Video, Scissors, PackageOpen, MessageCircle];

/**
 * The 100% money-back guarantee feature. Used on the homepage, the Why-us page
 * and the Returns page. `compact` drops the section padding for in-page use.
 */
export function Guarantee({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "" : "px-4 py-16 sm:px-6 sm:py-20"}>
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-violet-deep px-6 py-12 text-ivory shadow-card sm:rounded-[2.5rem] sm:px-12 sm:py-16">
        {/* ambient + botanicals */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-violet-bright/40 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        </div>
        <Leaf className="pointer-events-none absolute -bottom-6 left-4 h-56 w-auto text-white/10" />
        <Leaf flip className="pointer-events-none absolute -top-6 right-4 h-56 w-auto text-white/10" />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          {/* left — promise */}
          <div>
            <Reveal className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-luxe text-ivory/80">
              <ShieldCheck size={14} /> Shop with confidence
            </Reveal>
            <h2 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-medium leading-[1]">
              100%{" "}
              <span className="italic text-gold-soft">money-back</span>{" "}
              guarantee
            </h2>
            <Reveal i={1} as="p" className="mt-5 max-w-md text-ivory/80">
              {guarantee.intro}
            </Reveal>
            <Reveal i={2} className="mt-7">
              <Link
                href="/returns"
                className="inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-violet-deep shadow-soft transition-transform hover:scale-[1.03]"
              >
                Read the refund policy
              </Link>
            </Reveal>
          </div>

          {/* right — conditions */}
          <div className="rounded-[1.5rem] border border-white/15 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="mb-5 flex items-center gap-2 text-sm font-medium text-ivory/90">
              <PackageOpen size={18} className="text-gold-soft" />
              To claim a refund on a damaged item:
            </p>
            <ul className="space-y-4">
              {guarantee.conditions.map((c, i) => {
                const Icon = icons[i] ?? ShieldCheck;
                return (
                  <Reveal key={c} i={i} as="li" className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory/10 text-ivory">
                      <Icon size={17} />
                    </span>
                    <span className="text-sm leading-relaxed text-ivory/85">{c}</span>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

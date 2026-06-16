"use client";

const items = [
  "Necklaces",
  "Bracelets",
  "Rings",
  "Earrings",
  "Anklets",
  "Handcuffs",
  "Nails",
  "Earcuffs",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-plum/10 bg-violet-deep py-5 text-ivory">
      <div className="flex w-max animate-marquee [--marquee-duration:30s]">
        {row.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="font-display text-2xl tracking-wide sm:text-3xl">
              {item}
            </span>
            <span className="mx-7 text-gold-soft sm:mx-10">✦</span>
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-violet-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-violet-deep to-transparent" />
    </div>
  );
}

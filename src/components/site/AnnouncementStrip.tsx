import { Truck } from "lucide-react";

/** Slim promo band with a scrolling marquee on all screen sizes. */
export function AnnouncementStrip({ text }: { text?: string }) {
  if (!text?.trim()) return null;

  const item = (
    <span className="inline-flex items-center gap-2.5 px-8">
      <Truck size={14} className="shrink-0 text-gold" />
      <span>{text}</span>
    </span>
  );

  return (
    <div className="border-y border-plum/10 bg-cream/60 py-2.5 overflow-hidden">
      <div
        className="flex w-max animate-marquee whitespace-nowrap text-[11px] font-medium uppercase tracking-luxe text-violet-deep [--marquee-duration:22s]"
      >
        {item}{item}{item}{item}
      </div>
    </div>
  );
}

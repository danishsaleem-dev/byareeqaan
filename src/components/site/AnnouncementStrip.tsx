import { Truck } from "lucide-react";

/** Slim in-flow promo band (e.g. shipping note). Sits in the page, not pinned. */
export function AnnouncementStrip({ text }: { text?: string }) {
  if (!text?.trim()) return null;
  return (
    <div className="border-y border-plum/10 bg-cream/60 px-5 py-2.5 text-center sm:py-3.5">
      <p className="inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-luxe text-violet-deep sm:gap-2.5 sm:text-xs">
        <Truck size={13} className="shrink-0 text-gold sm:hidden" />
        <Truck size={15} className="hidden shrink-0 text-gold sm:inline" />
        {text}
      </p>
    </div>
  );
}

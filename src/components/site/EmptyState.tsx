import { WhatsAppIcon } from "@/components/BrandIcons";
import { waLink } from "@/lib/format";

export function EmptyState({
  title = "New pieces on the way",
  message = "We're styling and photographing the latest edit right now. Message us on WhatsApp and we'll share what's available.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="mx-auto max-w-md rounded-[1.6rem] border border-plum/10 bg-cream/40 px-8 py-14 text-center">
      <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-deep text-ivory">
        <svg viewBox="0 0 100 100" className="h-7 w-7" fill="none" aria-hidden>
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" />
          <path d="M50 22 L60 40 L40 40 Z" fill="currentColor" />
        </svg>
      </span>
      <h3 className="font-display text-2xl font-medium text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {message}
      </p>
      <a
        href={waLink("Hi By Areeqaan! What pieces do you have available right now? ✨")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-deep px-6 py-3 text-sm font-medium text-ivory shadow-soft transition-colors hover:bg-violet"
      >
        <WhatsAppIcon size={17} /> Ask on WhatsApp
      </a>
    </div>
  );
}

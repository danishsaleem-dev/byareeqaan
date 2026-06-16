import { Logo } from "./Logo";
import { site } from "@/lib/site";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "./BrandIcons";

const nav = [
  { label: "Collections", href: "#collections" },
  { label: "Story", href: "#story" },
  { label: "Why us", href: "#promise" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { href: `https://wa.me/${site.whatsapp.number}`, Icon: WhatsAppIcon, label: "WhatsApp" },
  { href: site.socials.instagram.url, Icon: InstagramIcon, label: "Instagram" },
  { href: site.socials.tiktok.url, Icon: TikTokIcon, label: "TikTok" },
  { href: site.socials.facebook.url, Icon: FacebookIcon, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="border-t border-plum/10 px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Logo className="h-20 w-auto" fallbackClassName="text-[30px]" stacked />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Minimal, trend-led jewellery — delivered across Pakistan and abroad.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-plum/80 transition-colors hover:text-violet-deep"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/15 text-plum transition-all duration-300 hover:border-violet hover:bg-violet-deep hover:text-ivory"
              >
                <s.Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-plum/10 pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Crafted with care · Minimal jewellery for the modern muse</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "./BrandIcons";

const shop = [
  { label: "Shop all", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Story", href: "/story" },
  { label: "Why us", href: "/why-us" },
  { label: "Contact", href: "/contact" },
];

const help = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns & exchanges", href: "/returns" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const socials = [
  { href: `https://wa.me/${site.whatsapp.number}`, Icon: WhatsAppIcon, label: "WhatsApp" },
  { href: site.socials.instagram.url, Icon: InstagramIcon, label: "Instagram" },
  { href: site.socials.tiktok.url, Icon: TikTokIcon, label: "TikTok" },
  { href: site.socials.facebook.url, Icon: FacebookIcon, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="border-t border-plum/10 px-5 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
          <div>
            <Link href="/" aria-label="By Areeqaan — home">
              <Logo className="h-20 w-auto" fallbackClassName="text-[30px]" stacked />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Minimal, trend-led jewellery — delivered across Pakistan and abroad.
            </p>
            <div className="mt-5 flex items-center gap-2">
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

          <FooterCol title="Shop" links={shop} />
          <FooterCol title="Help" links={help} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-plum/10 pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Crafted with care · Minimal jewellery for the modern muse</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-luxe text-violet">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-plum/80 transition-colors hover:text-violet-deep"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

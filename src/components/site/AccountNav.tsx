"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, User, MapPin, Package, Heart } from "lucide-react";

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/profile", label: "My details", icon: User },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/orders", label: "Orders", icon: Package, soon: true },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, soon: true },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        const Icon = l.icon;
        const content = (
          <span
            className={clsx(
              "flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors lg:rounded-xl",
              active
                ? "bg-violet-deep text-ivory"
                : "text-plum/80 hover:bg-plum/5 hover:text-violet-deep",
              l.soon && "opacity-60",
            )}
          >
            <Icon size={17} />
            {l.label}
            {l.soon && (
              <span className="ml-auto hidden rounded-full bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted lg:inline">
                Soon
              </span>
            )}
          </span>
        );
        return l.soon ? (
          <span key={l.href} className="cursor-default">
            {content}
          </span>
        ) : (
          <Link key={l.href} href={l.href}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

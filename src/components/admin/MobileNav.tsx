"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink, LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { logoutAction } from "@/app/admin/actions";

/** Mobile-only top bar + slide-in drawer. Mirrors the desktop sidebar. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (i.e. a nav link was tapped).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-black/[0.06] bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/admin" className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold text-violet-deep">
            By Areeqaan
          </span>
          <span className="text-[11px] text-muted">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-plum"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col bg-white py-5 shadow-xl">
            <div className="flex items-center justify-between px-5 pb-5">
              <Link href="/admin" className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold text-violet-deep">
                  By Areeqaan
                </span>
                <span className="text-xs text-muted">Admin</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-black/[0.04] hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <Sidebar />

            <div className="mt-auto space-y-1 px-3 pt-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-plum/70 transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                <ExternalLink size={18} /> View site
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-plum/70 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={18} /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

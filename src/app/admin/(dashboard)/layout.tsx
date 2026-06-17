import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { logoutAction } from "@/app/admin/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/[0.06] bg-white py-5 md:flex">
        <Link href="/admin" className="px-5 pb-5">
          <span className="font-display text-2xl font-semibold text-violet-deep">
            By Areeqaan
          </span>
          <span className="mt-0.5 block text-xs text-muted">Admin</span>
        </Link>
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
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="px-4 py-5 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-6xl">
            {configured ? children : <SetupNotice />}
          </div>
        </main>
      </div>
    </div>
  );
}

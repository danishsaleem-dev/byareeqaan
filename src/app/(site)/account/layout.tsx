import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getProfile } from "@/lib/account";
import { AccountNav } from "@/components/site/AccountNav";
import { signOutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account");

  const greeting = profile.fullName?.trim() || profile.email;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
      <header className="mb-8">
        <span className="text-xs font-medium uppercase tracking-luxe text-violet">
          My account
        </span>
        <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-medium leading-tight text-ink">
          Hi, <span className="italic text-gradient">{greeting}</span>
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav />
          <form action={signOutAction} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-plum/70 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={17} /> Sign out
            </button>
          </form>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}

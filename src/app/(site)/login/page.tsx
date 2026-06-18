import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/account";
import { CustomerLoginForm } from "@/components/site/CustomerLoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your By Areeqaan account to track orders and save your wishlist.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/account";

  // Already signed in → skip the form.
  const user = await getUser();
  if (user) redirect(next);

  return (
    <main className="mx-auto flex min-h-[80svh] max-w-md flex-col justify-center px-5 pb-20 pt-32 sm:px-6 sm:pt-40">
      <div className="mb-7 text-center">
        <span className="text-xs font-medium uppercase tracking-luxe text-violet">
          By Areeqaan
        </span>
        <h1 className="mt-2 font-display text-[clamp(2rem,6vw,3rem)] font-medium leading-tight text-ink">
          Welcome <span className="italic text-gradient">back</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in or create your account to track orders, save addresses and
          build your wishlist.
        </p>
      </div>

      <CustomerLoginForm next={next} initialError={sp.error} />
    </main>
  );
}

import type { Metadata } from "next";
import { getProfile, listAddresses } from "@/lib/account";
import { CheckoutForm } from "@/components/site/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [profile, addresses] = await Promise.all([
    getProfile().catch(() => null),
    listAddresses().catch(() => []),
  ]);
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
      <div className="mb-8 text-center">
        <span className="text-xs font-medium uppercase tracking-luxe text-violet">
          By Areeqaan
        </span>
        <h1 className="mt-2 font-display text-[clamp(2rem,5vw,2.75rem)] font-medium leading-tight text-ink">
          Complete your{" "}
          <span className="italic text-gradient">order</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Fill in your details, choose how you&apos;d like to pay, and we&apos;ll
          get it packed for you.
        </p>
      </div>

      <CheckoutForm
        prefillName={profile?.fullName}
        prefillEmail={profile?.email}
        prefillPhone={profile?.phone || defaultAddr?.phone}
        prefillAddress={defaultAddr?.address}
        prefillCity={defaultAddr?.city}
      />
    </main>
  );
}

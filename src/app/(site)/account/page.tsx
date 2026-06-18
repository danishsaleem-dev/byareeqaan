import Link from "next/link";
import { User, MapPin, Package, Heart, ArrowRight } from "lucide-react";
import { getProfile, listAddresses } from "@/lib/account";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const [profile, addresses] = await Promise.all([getProfile(), listAddresses()]);
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <div className="space-y-5">
      {/* details + address summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          href="/account/profile"
          icon={<User size={18} />}
          title="My details"
        >
          <p className="text-sm text-ink">{profile?.fullName || "Add your name"}</p>
          <p className="text-sm text-muted">{profile?.email}</p>
          {profile?.phone && <p className="text-sm text-muted">{profile.phone}</p>}
        </Card>

        <Card
          href="/account/addresses"
          icon={<MapPin size={18} />}
          title="Default address"
        >
          {defaultAddr ? (
            <div className="text-sm text-muted">
              <p className="text-ink">{defaultAddr.fullName}</p>
              <p>{defaultAddr.address}</p>
              <p>
                {defaultAddr.city}
                {defaultAddr.country ? `, ${defaultAddr.country}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">No address saved yet.</p>
          )}
        </Card>
      </div>

      {/* coming soon */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Soon icon={<Package size={18} />} title="Orders" note="Track every order here — coming with checkout." />
        <Soon icon={<Heart size={18} />} title="Wishlist" note="Save pieces you love for later." />
      </div>
    </div>
  );
}

function Card({
  href,
  icon,
  title,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-plum/10 bg-white p-5 transition-all hover:border-violet/30 hover:shadow-soft"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet-deep">
            {icon}
          </span>
          {title}
        </span>
        <ArrowRight
          size={16}
          className="text-muted transition-transform group-hover:translate-x-0.5"
        />
      </div>
      {children}
    </Link>
  );
}

function Soon({
  icon,
  title,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-plum/15 bg-cream/30 p-5">
      <span className="flex items-center gap-2 text-sm font-semibold text-plum/70">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum/5 text-plum/50">
          {icon}
        </span>
        {title}
        <span className="ml-auto rounded-full bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
          Soon
        </span>
      </span>
      <p className="mt-3 text-sm text-muted">{note}</p>
    </div>
  );
}

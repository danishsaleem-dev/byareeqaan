import { redirect } from "next/navigation";
import { getProfile } from "@/lib/account";
import { ProfileForm } from "@/components/site/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account/profile");

  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-medium text-ink">My details</h2>
      <p className="mb-5 text-sm text-muted">
        These help us reach you about your orders.
      </p>
      <ProfileForm profile={profile} />
    </div>
  );
}

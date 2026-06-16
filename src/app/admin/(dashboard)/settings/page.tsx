import { getSite } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const site = await getSite();
  return <SettingsForm initial={site} />;
}

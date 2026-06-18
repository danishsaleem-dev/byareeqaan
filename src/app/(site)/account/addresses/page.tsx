import { redirect } from "next/navigation";
import { getUser, listAddresses } from "@/lib/account";
import { AddressManager } from "@/components/site/AddressManager";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/account/addresses");

  const addresses = await listAddresses();
  return <AddressManager addresses={addresses} />;
}

import { listCollections } from "@/lib/data";
import { CollectionsManager } from "@/components/admin/CollectionsManager";

export default async function CollectionsPage() {
  const collections = await listCollections();
  return <CollectionsManager initial={collections} />;
}

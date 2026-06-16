import { listMedia } from "@/lib/data";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function MediaPage() {
  const files = await listMedia();
  return <MediaLibrary initial={files} />;
}

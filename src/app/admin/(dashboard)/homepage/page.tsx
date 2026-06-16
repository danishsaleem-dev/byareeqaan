import { getHomepage } from "@/lib/data";
import { HomepageEditor } from "@/components/admin/HomepageEditor";

export default async function HomepagePage() {
  const homepage = await getHomepage();
  return <HomepageEditor initial={homepage} />;
}

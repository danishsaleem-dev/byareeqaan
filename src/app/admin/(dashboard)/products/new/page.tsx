import { listCollections } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const collections = await listCollections();
  return <ProductForm collections={collections} />;
}

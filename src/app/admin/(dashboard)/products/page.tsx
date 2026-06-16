import { listProducts } from "@/lib/data";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function ProductsPage() {
  const products = await listProducts();
  return <ProductsTable initial={products} />;
}

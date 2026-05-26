import type { Product } from "@telugu-yuvatha/shared";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { ProductsManager } from "./products-manager";

export default async function ProductsPage() {
  const products = await api.get<Product[]>("/products").catch(() => []);
  const categories = await api.get<Array<{ id: string; name: string }>>("/categories").catch(() => []);
  const collections = await api.get<Array<{ id: string; name: string }>>("/collections").catch(() => []);

  return (
    <Shell>
      <ProductsManager initialProducts={products} categories={categories} collections={collections} />
    </Shell>
  );
}

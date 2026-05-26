import type { Category } from "@telugu-yuvatha/shared";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { CategoriesManager } from "./categories-manager";

export default async function CategoriesPage() {
  const rows = await api.get<Category[]>("/categories").catch(() => []);
  return (
    <Shell>
      <CategoriesManager initialRows={rows} />
    </Shell>
  );
}

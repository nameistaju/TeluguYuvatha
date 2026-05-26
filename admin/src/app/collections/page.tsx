import type { Collection } from "@telugu-yuvatha/shared";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { CollectionsManager } from "./collections-manager";

export default async function CollectionsPage() {
  const rows = await api.get<Collection[]>("/collections").catch(() => []);
  return (
    <Shell>
      <CollectionsManager initialRows={rows} />
    </Shell>
  );
}

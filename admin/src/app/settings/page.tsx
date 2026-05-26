import type { SiteSetting } from "@telugu-yuvatha/shared";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { SettingsManager } from "./settings-manager";

export default async function SettingsPage() {
  const rows = await api.get<SiteSetting[]>("/settings").catch(() => []);
  return (
    <Shell>
      <SettingsManager initialRows={rows} />
    </Shell>
  );
}

import { Settings } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { SettingsManager } from "./SettingsManager";

export default async function AdminSettingsPage() {
  await requireRole(["super_admin"]);
  const settings = await getSettings();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted">Site-wide configuration</p>
        </div>
      </div>
      <SettingsManager settings={settings} />
    </div>
  );
}

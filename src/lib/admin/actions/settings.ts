"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/lib/types";
import { revalidateAdmin } from "./shared";

// Keys of the `settings` table that the admin can edit.
export type SettingsKey = keyof SiteSettings;

// Deep partial: each section may be updated independently.
export type SettingsPatch = { [K in keyof SiteSettings]?: Partial<SiteSettings[K]> };

export async function updateSettings(patch: SettingsPatch): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();

  for (const key of Object.keys(patch)) {
    const value = patch[key as SettingsKey];
    if (!value || typeof value !== "object") continue;
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) return { error: error.message };
  }

  revalidateAdmin();
  return {};
}

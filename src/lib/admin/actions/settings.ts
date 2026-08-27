"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/lib/types";
import { revalidateAdmin } from "./shared";
import { deleteStorageImage } from "@/lib/admin/storage";

// Keys of the `settings` table that the admin can edit.
export type SettingsKey = keyof SiteSettings;

// Deep partial: each section may be updated independently.
export type SettingsPatch = { [K in keyof SiteSettings]?: Partial<SiteSettings[K]> };

export async function updateSettings(patch: SettingsPatch): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();

  // Read current values so we can clean up replaced/removed image URLs.
  const { data: currentRows } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", Object.keys(patch));
  const oldValues: Record<string, Record<string, unknown>> = {};
  for (const row of currentRows ?? []) {
    oldValues[row.key] = (row.value as Record<string, unknown>) ?? {};
  }

  for (const key of Object.keys(patch)) {
    const value = patch[key as SettingsKey];
    if (!value || typeof value !== "object") continue;
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) return { error: error.message };
  }

  revalidateAdmin();

  // Safely remove old cafe image assets (logo_url / hero_image) when replaced or
  // cleared. deleteStorageImage refuses non-bucket URLs, so static defaults like
  // /logo/logo.png are never touched. A URL still used by another cafe field is kept.
  const cafePatch = patch.cafe;
  if (cafePatch) {
    const imageFields = ["logo_url", "hero_image"] as const;
    for (const field of imageFields) {
      const newVal = cafePatch[field];
      const oldVal = oldValues["cafe"]?.[field];
      if (typeof oldVal === "string" && oldVal && oldVal !== newVal) {
        const stillUsed = imageFields.some(
          (other) => other !== field && cafePatch[other] === oldVal
        );
        if (!stillUsed) await deleteStorageImage(oldVal);
      }
    }
  }

  return {};
}

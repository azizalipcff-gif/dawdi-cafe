"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/lib/types";
import { revalidateAdmin, dbError } from "./shared";
import { deleteStorageImage } from "@/lib/admin/storage";
import { validateSettings } from "./validation";
import { rateLimitAdmin } from "@/lib/rate-limit";

// Keys of the `settings` table that the admin can edit.
export type SettingsKey = keyof SiteSettings;

// Deep partial: each section may be updated independently.
export type SettingsPatch = { [K in keyof SiteSettings]?: Partial<SiteSettings[K]> };

const SETTINGS_SECTIONS: SettingsKey[] = [
  "cafe",
  "contact",
  "hours",
  "seo",
  "design",
  "footer",
];

export async function updateSettings(patch: SettingsPatch): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  const parsed = validateSettings(patch as Record<string, unknown>);
  if (!parsed.ok) return { error: parsed.error };
  const cleanPatch = parsed.value as SettingsPatch;
  const supabase = createAdminClient();

  // Only allow known top-level settings sections to be written (mass-assignment
  // guard — a caller cannot create arbitrary settings rows).
  const keys = (Object.keys(cleanPatch) as SettingsKey[]).filter((k) =>
    (SETTINGS_SECTIONS as string[]).includes(k)
  );

  // Read current values so we can clean up replaced/removed image URLs.
  const { data: currentRows } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", keys);
  const oldValues: Record<string, Record<string, unknown>> = {};
  for (const row of currentRows ?? []) {
    oldValues[row.key] = (row.value as Record<string, unknown>) ?? {};
  }

  for (const key of keys) {
    const value = cleanPatch[key];
    if (!value || typeof value !== "object") continue;
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) return dbError(error);
  }

  revalidateAdmin();

  // Safely remove old cafe image assets (logo_url / hero_image) when replaced or
  // cleared. deleteStorageImage refuses non-bucket URLs, so static defaults like
  // /logo/logo.png are never touched. A URL still used by another cafe field is kept.
  const cafePatch = cleanPatch.cafe;
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

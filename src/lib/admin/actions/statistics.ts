"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BusinessStatistic } from "@/lib/types";
import { revalidateAdmin, revalidatePublic, isValidId, dbError, pickAllowed } from "./shared";
import { rateLimitAdmin } from "@/lib/rate-limit";

export type StatisticInput = Omit<BusinessStatistic, "id" | "created_at" | "updated_at">;
export type StatisticPatch = Partial<Pick<BusinessStatistic, "label" | "value" | "description" | "sort_order" | "is_active" | "use_real_count" | "key">>;

const STAT_FIELDS = ["key", "label", "value", "description", "use_real_count", "sort_order", "is_active"] as const;

export async function createStatistic(input: StatisticInput): Promise<{ error?: string; data?: BusinessStatistic }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("business_statistics").insert(input).select().single();
  if (error) return dbError(error);
  revalidateAdmin();
  revalidatePublic();
  return { data: data as BusinessStatistic };
}

export async function updateStatistic(id: string, patch: StatisticPatch): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid id." };
  const supabase = createAdminClient();
  const clean = pickAllowed(patch as Record<string, unknown>, STAT_FIELDS);
  const { error } = await supabase.from("business_statistics").update(clean).eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();
  revalidatePublic();
  return {};
}

export async function deleteStatistic(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid id." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("business_statistics").delete().eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();
  revalidatePublic();
  return {};
}

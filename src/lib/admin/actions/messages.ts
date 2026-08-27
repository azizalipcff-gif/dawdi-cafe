"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateAdmin, isValidId, dbError } from "./shared";
import { rateLimitAdmin } from "@/lib/rate-limit";

export async function updateMessageRead(
  id: string,
  isRead: boolean
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid message id." };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("messages")
    .select("id")
    .eq("id", id)
    .single();
  if (!existing) return { error: "Message not found." };

  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return dbError(error);

  revalidateAdmin();
  return {};
}

export async function deleteMessage(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid message id." };

  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("messages")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return dbError(error);
  if (count === 0) return { error: "Message not found." };

  revalidateAdmin();
  return {};
}

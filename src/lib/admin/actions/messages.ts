"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateAdmin } from "./shared";

function isValidId(id: string): boolean {
  return typeof id === "string" && id.trim().length > 0;
}

export async function updateMessageRead(
  id: string,
  isRead: boolean
): Promise<{ error?: string }> {
  await requireAdmin();
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
  if (error) return { error: error.message };

  revalidateAdmin();
  return {};
}

export async function deleteMessage(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!isValidId(id)) return { error: "Invalid message id." };

  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("messages")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (count === 0) return { error: "Message not found." };

  revalidateAdmin();
  return {};
}

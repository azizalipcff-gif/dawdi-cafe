"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";

// Public: send a contact message
export async function createMessage(formData: FormData) {
  const parsed = messageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    ...parsed.data,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject || null,
    is_read: false,
  });
  if (error) return { error: error.message };
  return { success: true };
}

// Admin: toggle read status
export async function toggleMessageRead(id: string, isRead: boolean) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/messages", "layout");
  revalidatePath("/admin", "layout");
  return { success: true };
}

// Admin: toggle replied status
export async function toggleMessageReplied(id: string, replied: boolean) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .update({ is_replied: replied, is_read: replied ? true : undefined })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/messages", "layout");
  revalidatePath("/admin", "layout");
  return { success: true };
}

// Admin: toggle archive status
export async function toggleMessageArchived(id: string, archived: boolean) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ is_archived: archived }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/messages", "layout");
  revalidatePath("/admin", "layout");
  return { success: true };
}

// Admin: delete message
export async function deleteMessage(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/messages", "layout");
  revalidatePath("/admin", "layout");
  return { success: true };
}

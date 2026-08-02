"use server";

import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validation";

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

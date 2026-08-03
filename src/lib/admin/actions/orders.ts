"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";
import { revalidateAdmin } from "./shared";

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

export async function deleteOrder(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";
import { revalidateAdmin, isValidId, dbError } from "./shared";
import { rateLimitAdmin } from "@/lib/rate-limit";

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid order id." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();
  return {};
}

export async function deleteOrder(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid order id." };
  const supabase = createAdminClient();
  const { error, count } = await supabase
    .from("orders")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return dbError(error);
  if (count === 0) return { error: "Order not found." };
  revalidateAdmin();
  return {};
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { orderSchema, orderStatusSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";
import type { OrderStatus, OrderItem } from "@/lib/types";

// Public: place an order from the cart
export async function createOrder(formData: FormData) {
  let items: OrderItem[] = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Invalid cart data" };
  }

  const parsed = orderSchema.safeParse({
    customer_name: formData.get("customer_name"),
    customer_phone: formData.get("customer_phone"),
    items,
    total: formData.get("total"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert({
    customer_name: parsed.data.customer_name,
    customer_phone: parsed.data.customer_phone,
    items: parsed.data.items,
    total: parsed.data.total,
    notes: parsed.data.notes || null,
    status: "pending",
  });
  if (error) return { error: error.message };
  return { success: true };
}

// Admin: update order status
export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireRole(["super_admin", "manager", "employee"]);

  const parsed = orderStatusSchema.safeParse({ status });
  if (!parsed.success) return { error: "Invalid status" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/orders", "layout");
  revalidatePath("/admin", "layout");
  return { success: true };
}

// Admin: delete order
export async function deleteOrder(id: string) {
  await requireRole(["super_admin", "manager", "employee"]);

  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/orders", "layout");
  revalidatePath("/admin", "layout");
  return { success: true };
}
